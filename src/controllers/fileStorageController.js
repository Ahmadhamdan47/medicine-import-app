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
