export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
}

export interface DriveAboutInfo {
  user?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
  };
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3/files';

export const fetchDriveAbout = async (accessToken: string): Promise<DriveAboutInfo> => {
  const res = await fetch(`${DRIVE_API_BASE}/about?fields=user,storageQuota`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch Drive account info: ${errorText}`);
  }

  return res.json();
};

export const listDriveFiles = async (
  accessToken: string,
  options?: {
    query?: string;
    folderId?: string;
    pageSize?: number;
  }
): Promise<GoogleDriveFile[]> => {
  const pageSize = options?.pageSize || 30;
  const qParts: string[] = ['trashed = false'];

  if (options?.folderId) {
    qParts.push(`'${options.folderId}' in parents`);
  }

  if (options?.query && options.query.trim()) {
    const escaped = options.query.replace(/'/g, "\\'");
    qParts.push(`name contains '${escaped}'`);
  }

  const q = encodeURIComponent(qParts.join(' and '));
  const fields = encodeURIComponent('files(id, name, mimeType, iconLink, webViewLink, webContentLink, size, createdTime, modifiedTime, thumbnailLink)');
  const url = `${DRIVE_API_BASE}/files?q=${q}&pageSize=${pageSize}&orderBy=modifiedTime desc&fields=${fields}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Drive API error: ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
};

export const uploadDriveFile = async (
  accessToken: string,
  file: File,
  folderId?: string
): Promise<GoogleDriveFile> => {
  const metadata: Record<string, any> = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const res = await fetch(`${DRIVE_UPLOAD_BASE}?uploadType=multipart&fields=id,name,mimeType,webViewLink,size`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return res.json();
};

export const createDriveFolder = async (
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<GoogleDriveFile> => {
  const metadata: Record<string, any> = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(`${DRIVE_API_BASE}/files?fields=id,name,mimeType,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Folder creation failed: ${errText}`);
  }

  return res.json();
};

export const deleteDriveFile = async (
  accessToken: string,
  fileId: string
): Promise<void> => {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`File deletion failed: ${errText}`);
  }
};

export const uploadJsonBackupToDrive = async (
  accessToken: string,
  filename: string,
  jsonData: any
): Promise<GoogleDriveFile> => {
  const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const file = new File([jsonBlob], filename, { type: 'application/json' });
  return uploadDriveFile(accessToken, file);
};
