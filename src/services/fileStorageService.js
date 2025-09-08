// File Storage Service
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

class FileStorageService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || './uploads';
        this.maxFileSize = process.env.MAX_FILE_SIZE || 10 * 1024 * 1024; // 10MB default
        this.allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.csv', '.xlsx'];
    }

    // Upload file
    async uploadFile(file, metadata = {}) {
        try {
            // Validate file
            this.validateFile(file);

            // Generate unique file ID
            const fileId = this.generateFileId();
            const fileExtension = path.extname(file.originalname);
            const fileName = `${fileId}${fileExtension}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Calculate checksum
            const checksum = this.calculateChecksum(file.buffer);

            // Ensure upload directory exists
            await this.ensureUploadDir();

            // Save file
            await fs.writeFile(filePath, file.buffer);

            // Store file metadata (in production, you might want to store this in database)
            const fileMetadata = {
                fileId,
                originalName: file.originalname,
                fileName,
                filePath,
                fileSize: file.size,
                mimeType: file.mimetype,
                checksum,
                uploadDate: new Date(),
                metadata
            };

            return {
                fileId,
                url: this.generateFileUrl(fileId),
                checksum,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype
            };
        } catch (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

    // Get file by ID
    async getFile(fileId) {
        try {
            const filePath = await this.getFilePath(fileId);
            
            // Check if file exists
            try {
                await fs.access(filePath);
            } catch (error) {
                throw new Error('File not found');
            }

            // Generate signed URL (in production, you might use cloud storage signed URLs)
            const signedUrl = this.generateSignedUrl(fileId);
            
            return {
                fileId,
                url: signedUrl,
                filePath
            };
        } catch (error) {
            throw new Error(`Error retrieving file: ${error.message}`);
        }
    }

    // Delete file
    async deleteFile(fileId) {
        try {
            const filePath = await this.getFilePath(fileId);
            
            // Delete file from storage
            try {
                await fs.unlink(filePath);
            } catch (error) {
                // File might not exist, continue
            }

            return { message: 'File deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting file: ${error.message}`);
        }
    }

    // Validate file
    validateFile(file) {
        if (!file) {
            throw new Error('No file provided');
        }

        if (file.size > this.maxFileSize) {
            throw new Error(`File size exceeds maximum allowed size of ${this.maxFileSize} bytes`);
        }

        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!this.allowedExtensions.includes(fileExtension)) {
            throw new Error(`File type ${fileExtension} is not allowed`);
        }
    }

    // Generate unique file ID
    generateFileId() {
        return crypto.randomBytes(16).toString('hex');
    }

    // Calculate file checksum
    calculateChecksum(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }

    // Ensure upload directory exists
    async ensureUploadDir() {
        try {
            await fs.access(this.uploadDir);
        } catch (error) {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }

    // Get file path by ID
    async getFilePath(fileId) {
        // In production, you would query the database for file metadata
        // For now, we'll scan the upload directory
        const files = await fs.readdir(this.uploadDir);
        const matchingFile = files.find(file => file.startsWith(fileId));
        
        if (!matchingFile) {
            throw new Error('File not found');
        }

        return path.join(this.uploadDir, matchingFile);
    }

    // Check if file exists
    async fileExists(fileId) {
        try {
            await this.getFilePath(fileId);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Generate file URL
    generateFileUrl(fileId) {
        return `/files/${fileId}`;
    }

    // Generate signed URL (for secure downloads)
    generateSignedUrl(fileId, expiresIn = 3600) {
        // In production, you would generate actual signed URLs
        // For now, return a simple URL with expiration timestamp
        const expires = Date.now() + (expiresIn * 1000);
        const signature = crypto.createHmac('sha256', process.env.FILE_SECRET || 'file_secret')
            .update(`${fileId}:${expires}`)
            .digest('hex');
        
        return `/files/${fileId}?expires=${expires}&signature=${signature}`;
    }

    // Verify signed URL
    verifySignedUrl(fileId, expires, signature) {
        const expectedSignature = crypto.createHmac('sha256', process.env.FILE_SECRET || 'file_secret')
            .update(`${fileId}:${expires}`)
            .digest('hex');
        
        if (signature !== expectedSignature) {
            throw new Error('Invalid signature');
        }

        if (Date.now() > parseInt(expires)) {
            throw new Error('URL expired');
        }

        return true;
    }
}

module.exports = new FileStorageService();
