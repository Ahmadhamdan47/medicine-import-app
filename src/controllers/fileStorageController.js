// File Storage Controller
const FileStorageService = require('../services/fileStorageService');

class FileStorageController {
    // POST /files - Upload file
    async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    error: 'No file provided' 
                });
            }

            const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
            const result = await FileStorageService.uploadFile(req.file, metadata);
            
            res.status(201).json({
                message: 'File uploaded successfully',
                ...result
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /files/registration/upload - Upload file for registration (Public)
    async uploadRegistrationFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    error: 'No file provided' 
                });
            }

            // Validate file types for registration documents
            const allowedMimeTypes = [
                'image/jpeg', 
                'image/png', 
                'image/jpg', 
                'application/pdf', 
                'image/webp'
            ];

            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    error: 'Invalid file type. Only JPEG, PNG, PDF and WebP files are allowed for registration.'
                });
            }

            // Additional metadata for registration files
            const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
            
            // Add registration-specific metadata
            metadata.isRegistrationFile = true;
            metadata.registrationType = req.body.registrationType || 'general';
            metadata.uploadedAt = new Date().toISOString();
            
            const result = await FileStorageService.uploadFile(req.file, metadata);
            
            res.status(201).json({
                message: 'Registration file uploaded successfully',
                ...result
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /files/registration/:fileId/access - Get signed URL for registration file (Public)
    async getRegistrationFileAccess(req, res) {
        try {
            const { fileId } = req.params;
            let { expiresIn } = req.query;

            // Validate and limit expiration time for registration files (max 30 minutes)
            expiresIn = parseInt(expiresIn) || 1800; // Default 30 minutes
            if (expiresIn > 1800) {
                return res.status(400).json({
                    error: 'Maximum expiration time for registration files is 30 minutes (1800 seconds)'
                });
            }

            // Check if file exists and is a registration file
            const fileExists = await FileStorageService.fileExists(fileId);
            if (!fileExists) {
                return res.status(404).json({
                    error: 'File not found'
                });
            }

            // For registration files, we should verify it's actually a registration file
            // This would typically be checked against stored metadata
            const signedUrl = FileStorageService.generateSignedUrl(fileId, expiresIn);
            const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

            res.status(200).json({
                message: 'Signed URL generated successfully',
                signedUrl: signedUrl,
                expiresAt: expiresAt
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /files/:fileId - Get file or signed URL
    async getFile(req, res) {
        try {
            const { fileId } = req.params;
            const { expires, signature } = req.query;

            // If signed URL parameters are provided, verify them
            if (expires && signature) {
                FileStorageService.verifySignedUrl(fileId, expires, signature);
            }

            const result = await FileStorageService.getFile(fileId);
            
            // For direct file download, serve the file
            if (req.query.download === 'true') {
                return res.download(result.filePath);
            }

            // Otherwise, return signed URL
            res.status(200).json({
                message: 'File retrieved successfully',
                ...result
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // DELETE /files/:fileId - Delete file
    async deleteFile(req, res) {
        try {
            const { fileId } = req.params;
            const result = await FileStorageService.deleteFile(fileId);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /files/:fileId/download - Direct file download
    async downloadFile(req, res) {
        try {
            const { fileId } = req.params;
            const { expires, signature } = req.query;

            // Verify signed URL if parameters are provided
            if (expires && signature) {
                FileStorageService.verifySignedUrl(fileId, expires, signature);
            }

            const result = await FileStorageService.getFile(fileId);
            
            // Set appropriate headers for file download
            res.setHeader('Content-Disposition', 'attachment');
            res.sendFile(result.filePath, { root: '.' });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new FileStorageController();
