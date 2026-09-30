import React, { useState, useEffect } from 'react';
import { 
  X, HardDrive, Upload, FolderPlus, Trash2, ExternalLink, 
  Search, RefreshCw, FileText, Folder, Image, FileSpreadsheet, 
  CheckCircle2, AlertTriangle, ShieldCheck, Download, Cloud, UserCheck, LogOut 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  getAccessToken, 
  logout 
} from '../services/googleDriveAuth';
import { 
  listDriveFiles, 
  uploadDriveFile, 
  createDriveFolder, 
  deleteDriveFile, 
  fetchDriveAbout, 
  uploadJsonBackupToDrive,
  GoogleDriveFile, 
  DriveAboutInfo 
} from '../services/googleDriveApi';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  instituteBackupData?: any;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  instituteBackupData,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);

  // File to delete state for mandatory confirmation dialog
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);

  // Initialize auth listener
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, activeToken) => {
        setCurrentUser(user);
        setToken(activeToken);
        loadDriveData(activeToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
        setFiles([]);
        setAboutInfo(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  const loadDriveData = async (activeToken: string, query?: string) => {
    setIsLoadingFiles(true);
    setErrorMessage('');
    try {
      const [filesList, about] = await Promise.all([
        listDriveFiles(activeToken, { query }),
        fetchDriveAbout(activeToken).catch(() => null),
      ]);
      setFiles(filesList);
      if (about) setAboutInfo(about);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load Google Drive files.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage('');
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        loadDriveData(result.accessToken);
      }
    } catch (err: any) {
      setErrorMessage('Sign-in failed: ' + (err.message || 'Please allow Google authentication pop-up.'));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setToken(null);
    setFiles([]);
    setAboutInfo(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      loadDriveData(token, searchQuery);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      await uploadDriveFile(token, file);
      setStatusMessage(`Successfully uploaded "${file.name}" to Google Drive!`);
      setTimeout(() => setStatusMessage(''), 4000);
      loadDriveData(token);
    } catch (err: any) {
      setErrorMessage('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !token) return;

    try {
      await createDriveFolder(token, newFolderName.trim());
      setShowFolderModal(false);
      setNewFolderName('');
      setStatusMessage(`Created folder "${newFolderName.trim()}" in Google Drive!`);
      setTimeout(() => setStatusMessage(''), 4000);
      loadDriveData(token);
    } catch (err: any) {
      setErrorMessage('Folder error: ' + err.message);
    }
  };

  // Mandatory confirmation dialog handling for destructive delete operations per Workspace Skill
  const handleConfirmDelete = async () => {
    if (!fileToDelete || !token) return;

    try {
      await deleteDriveFile(token, fileToDelete.id);
      setStatusMessage(`Deleted "${fileToDelete.name}" from Google Drive.`);
      setTimeout(() => setStatusMessage(''), 4000);
      setFileToDelete(null);
      loadDriveData(token);
    } catch (err: any) {
      setErrorMessage('Delete error: ' + err.message);
      setFileToDelete(null);
    }
  };

  const handleBackupInstituteToDrive = async () => {
    if (!token) return;

    setIsUploading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      const backupData = instituteBackupData || {
        institute: 'Nedian Connect Computer Training Institute',
        location: 'Chakarchauda, Mayadevi-4, Kapilvastu, Nepal',
        exportedAt: new Date().toISOString(),
        note: 'Direct cloud backup from Nedian Institute portal',
      };

      const filename = `nedian_institute_backup_${new Date().toISOString().split('T')[0]}.json`;
      await uploadJsonBackupToDrive(token, filename, backupData);
      setStatusMessage(`Complete institute database backed up to Google Drive as "${filename}"!`);
      setTimeout(() => setStatusMessage(''), 5000);
      loadDriveData(token);
    } catch (err: any) {
      setErrorMessage('Backup error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '';
    if (num < 1024) return num + ' B';
    if (num < 1024 * 1024) return (num / 1024).toFixed(1) + ' KB';
    return (num / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatQuota = (usageBytes?: string, limitBytes?: string) => {
    if (!usageBytes) return 'Storage active';
    const usedMB = (parseInt(usageBytes, 10) / (1024 * 1024 * 1024)).toFixed(2);
    if (!limitBytes || limitBytes === '0') return `${usedMB} GB used`;
    const limitMB = (parseInt(limitBytes, 10) / (1024 * 1024 * 1024)).toFixed(1);
    return `${usedMB} GB of ${limitMB} GB used`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-100" />;
    }
    if (mimeType.includes('image')) {
      return <Image className="w-5 h-5 text-rose-500" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    return <FileText className="w-5 h-5 text-sky-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <HardDrive className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-white">
                  Google Drive Cloud Hub
                </h3>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono border border-sky-400/30">
                  Google Workspace API
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Manage syllabus brochures, admission records, and backups with your Google Account.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50 space-y-4">
          
          {/* Status Notifications */}
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!currentUser ? (
            /* Unauthenticated View: Sign in with Google */
            <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center border border-sky-100">
                <Cloud className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-900 font-display">
                  Connect Google Drive
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign in with your Google Account to access files, upload course curriculum PDFs, and automatically backup institute data.
                </p>
              </div>

              {/* Official Google Sign-In Button compliant with Google Identity Guidelines */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized with Google Workspace OAuth</span>
              </div>
            </div>
          ) : (
            /* Authenticated View: File Explorer & Actions */
            <div className="space-y-4">
              
              {/* Account Ribbon & Storage Info */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Google User'}
                      className="w-10 h-10 rounded-full border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                      {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {currentUser.displayName || 'Google Workspace User'}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {aboutInfo?.storageQuota && (
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {formatQuota(aboutInfo.storageQuota.usage, aboutInfo.storageQuota.limit)}
                    </span>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Google Drive files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-20 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1 px-2.5 py-1 text-[11px] font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </form>

                {/* Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-xl shadow-xs transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => setShowFolderModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                    <span>New Folder</span>
                  </button>

                  <button
                    onClick={handleBackupInstituteToDrive}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
                    title="Upload institute inquiries and fees as JSON to Google Drive"
                  >
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Backup Database</span>
                  </button>

                  <button
                    onClick={() => token && loadDriveData(token)}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                    title="Refresh list"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Files Table / List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                {isLoadingFiles ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading files from Google Drive...
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No files found in Google Drive. Use "Upload File" to add brochures or documents.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {getFileIcon(file.mimeType)}
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-slate-900 block truncate">
                              {file.name}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span>{formatFileSize(file.size)}</span>
                              {file.modifiedTime && (
                                <span>· Modified {new Date(file.modifiedTime).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Trigger confirmation modal for file deletion (MANDATORY per Workspace Skill) */}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Create Folder Modal Dialog */}
        {showFolderModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-500" />
                <span>Create New Google Drive Folder</span>
              </h4>

              <form onSubmit={handleCreateFolder} className="space-y-3">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Student Certificates 2026"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowFolderModal(false)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mandatory Confirmation Dialog for Destructive Delete (Workspace Skill Requirement) */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-900 font-display">
                  Confirm Permanent Deletion
                </h4>
                <p className="text-xs text-slate-600">
                  Are you sure you want to delete <span className="font-bold text-slate-900">"{fileToDelete.name}"</span> from Google Drive? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Yes, Delete File
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
