/**
 * JWB STUDIO Google Drive bridge.
 * Deploy as a web app that executes as the script owner.
 * The shared secret must match the Supabase Edge Function secret.
 */
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
const MAX_THUMBNAIL_BYTES = 20 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_THUMBNAIL_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

function doGet() {
  return jsonOutput({ status: 'ready', service: 'JWB STUDIO Drive bridge' });
}

// Run once from the editor to trigger Drive authorization and confirm access.
function authorizeDriveAccess() {
  Drive.Files.list({ pageSize: 1, fields: 'files(id,name)' });
  return 'Google Drive 권한이 준비되었습니다.';
}

function doPost(event) {
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 12000) return jsonOutput({ error: '요청 형식이 올바르지 않습니다.' });
    const request = JSON.parse(raw);
    const configuredSecret = PropertiesService.getScriptProperties().getProperty('JWB_SHARED_SECRET');
    if (!configuredSecret || !request.sharedSecret || request.sharedSecret !== configuredSecret) {
      return jsonOutput({ error: '인증되지 않은 요청입니다.' });
    }

    if (request.action === 'start') return startUpload(request);
    if (request.action === 'share') return shareFile(request.fileId);
    if (request.action === 'delete') return deleteFile(request.fileId);
    return jsonOutput({ error: '지원하지 않는 작업입니다.' });
  } catch (error) {
    console.error('Drive bridge error', error && error.message ? error.message : error);
    return jsonOutput({ error: 'Google Drive 요청을 처리하지 못했습니다. Apps Script 실행 기록을 확인해 주세요.' });
  }
}

function startUpload(request) {
  const kind = ['attachment', 'thumbnail'].indexOf(request.kind) !== -1 ? request.kind : 'video';
  const mimeType = String(request.mimeType || '');
  const size = Number(request.size);
  const allowedTypes = kind === 'attachment' ? ALLOWED_ATTACHMENT_TYPES : kind === 'thumbnail' ? ALLOWED_THUMBNAIL_TYPES : ALLOWED_VIDEO_TYPES;
  const maxBytes = kind === 'attachment' ? MAX_ATTACHMENT_BYTES : kind === 'thumbnail' ? MAX_THUMBNAIL_BYTES : MAX_VIDEO_BYTES;
  if (allowedTypes.indexOf(mimeType) === -1 || !Number.isSafeInteger(size) || size < 1 || size > maxBytes) {
    const message = kind === 'attachment'
      ? 'PDF·이미지·텍스트·Office 문서, 파일당 최대 20MB까지 첨부할 수 있습니다.'
      : kind === 'thumbnail'
        ? 'JPG/PNG/WebP 썸네일, 최대 20MB 파일만 업로드할 수 있습니다.'
        : 'MP4/WebM 동영상, 최대 100MB 파일만 업로드할 수 있습니다.';
    return jsonOutput({ error: message });
  }

  const safeName = String(request.name || 'portfolio-video')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
    .slice(0, 180);
  const metadata = { name: safeName, mimeType: mimeType };
  const properties = PropertiesService.getScriptProperties();
  const folderId = kind === 'attachment'
    ? (properties.getProperty('1NWqJe5TxZQbL5Ii6-P9HGoXwcUybJNt6') || properties.getProperty('1hVzBUe4bkpflJeYkFLp914K4p3G2vK2z'))
    : kind === 'thumbnail'
      ? (properties.getProperty('1hVzBUe4bkpflJeYkFLp914K4p3G2vK2z') || properties.getProperty('1hVzBUe4bkpflJeYkFLp914K4p3G2vK2z'))
      : properties.getProperty('1hVzBUe4bkpflJeYkFLp914K4p3G2vK2z');
  if (folderId) metadata.parents = [folderId];

  const query = '?uploadType=resumable&fields=id,name,mimeType,webViewLink';
  const response = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files' + query, {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      'X-Upload-Content-Type': mimeType,
      'X-Upload-Content-Length': String(size)
    },
    payload: JSON.stringify(metadata),
    muteHttpExceptions: true
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    console.error('Drive resumable session failed', response.getResponseCode(), response.getContentText());
    return jsonOutput({ error: 'Google Drive 업로드 세션을 만들지 못했습니다. Drive 서비스 권한과 폴더 ID를 확인해 주세요.' });
  }

  const responseHeaders = response.getAllHeaders();
  const locationKey = Object.keys(responseHeaders).find(function (key) { return key.toLowerCase() === 'location'; });
  const uploadUrl = locationKey ? String(responseHeaders[locationKey]) : '';
  if (!/^https:\/\/www\.googleapis\.com\//.test(uploadUrl)) {
    return jsonOutput({ error: 'Google Drive가 올바른 업로드 주소를 반환하지 않았습니다.' });
  }
  return jsonOutput({ uploadUrl: uploadUrl });
}

function shareFile(fileId) {
  if (!validFileId(fileId)) return jsonOutput({ error: '잘못된 Google Drive 파일 ID입니다.' });
  const permission = driveRequest('https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(fileId) + '/permissions?fields=id,type,role', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ type: 'anyone', role: 'reader' })
  });
  if (!permission.ok) {
    console.error('Drive permission failed', permission.status, permission.text);
    return jsonOutput({ error: '파일을 공개할 수 없습니다. Google Drive 공유 설정을 확인해 주세요.' });
  }
  const file = driveRequest('https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(fileId) + '?fields=id,name,mimeType,webViewLink', { method: 'get' });
  if (!file.ok) return jsonOutput({ error: '업로드한 Drive 파일 정보를 확인하지 못했습니다.' });
  const data = JSON.parse(file.text);
  return jsonOutput({
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    webViewLink: data.webViewLink || 'https://drive.google.com/file/d/' + data.id + '/view'
  });
}

function deleteFile(fileId) {
  if (!validFileId(fileId)) return jsonOutput({ error: '잘못된 Google Drive 파일 ID입니다.' });
  const result = driveRequest('https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(fileId), { method: 'delete' });
  if (!result.ok && result.status !== 404) {
    console.error('Drive delete failed', result.status, result.text);
    return jsonOutput({ error: 'Google Drive 파일을 삭제하지 못했습니다.' });
  }
  return jsonOutput({ deleted: true });
}

function driveRequest(url, options) {
  const response = UrlFetchApp.fetch(url, Object.assign({}, options, {
    headers: Object.assign({}, options.headers || {}, { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }),
    muteHttpExceptions: true
  }));
  const status = response.getResponseCode();
  return { ok: status >= 200 && status < 300, status: status, text: response.getContentText() };
}

function validFileId(fileId) {
  return /^[A-Za-z0-9_-]{10,}$/.test(String(fileId || ''));
}

function jsonOutput(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
