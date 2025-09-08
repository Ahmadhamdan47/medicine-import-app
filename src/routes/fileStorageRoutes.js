// File Storage routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const FileStorageController = require('../controllers/fileStorageController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const { registrationUploadRateLimit } = require('../middlewares/rateLimiter');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         fileId:
 *           type: string
 *         url:
 *           type: string
 *         checksum:
 *           type: string
 *         fileName:
 *           type: string
 *         fileSize:
 *           type: integer
 *         mimeType:
 *           type: string
 *     FileDownloadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         fileId:
 *           type: string
 *         url:
 *           type: string
 *         filePath:
 *           type: string
 */

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload file
 *     description: Upload a file to the storage system
 *     tags: [File Storage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               metadata:
 *                 type: string
 *                 description: JSON string containing file metadata
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Bad request - no file provided or invalid file *       403:
 *         description: Access denied
 */
router.post('/', authenticateToken, upload.single('file'), FileStorageController.uploadFile);
router.post('/upload', authenticateToken, upload.single('file'), FileStorageController.uploadFile); // Alternative upload endpoint

/**
 * @swagger
 * /files/registration/upload:
 *   post:
 *     summary: Upload file for registration (Public)
 *     description: Upload a file for account registration purposes - no authentication required
 *     tags: [File Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (documents for registration)
 *               metadata:
 *                 type: string
 *                 description: JSON string containing file metadata
 *               registrationType:
 *                 type: string
 *                 enum: [profile_picture, license, certificate, identity_document, company_registration]
 *                 description: Type of registration document being uploaded
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Bad request - no file provided or invalid file
 *       413:
 *         description: File too large
 */
router.post('/registration/upload', registrationUploadRateLimit, upload.single('file'), FileStorageController.uploadRegistrationFile);

/**
 * @swagger
 * /files/registration/{fileId}/access:
 *   get:
 *     summary: Get signed URL for registration file (Public)
 *     description: Generate a temporary signed URL to access a registration file - no authentication required
 *     tags: [File Storage]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID
 *       - in: query
 *         name: expiresIn
 *         schema:
 *           type: integer
 *           default: 1800
 *         description: URL expiration time in seconds (max 30 minutes for registration files)
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 signedUrl:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *       404:
 *         description: File not found or not a registration file
 *       400:
 *         description: Invalid expiration time
 */
router.get('/registration/:fileId/access', registrationUploadRateLimit, FileStorageController.getRegistrationFileAccess);

/**
 * @swagger
 * /files/{fileId}:
 *   get:
 *     summary: Get file or signed URL
 *     description: Get file information or signed download URL
 *     tags: [File Storage]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The file ID
 *       - in: query
 *         name: download
 *         schema:
 *           type: boolean
 *         description: Set to true for direct file download
 *       - in: query
 *         name: expires
 *         schema:
 *           type: string
 *         description: Expiration timestamp for signed URL
 *       - in: query
 *         name: signature
 *         schema:
 *           type: string
 *         description: Signature for signed URL verification
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileDownloadResponse'
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *   delete:
 *     summary: Delete file
 *     description: Delete a file from storage
 *     tags: [File Storage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get('/:fileId', FileStorageController.getFile);
router.delete('/:fileId', authenticateToken, authorizeRoles('admin', 'import_export'), FileStorageController.deleteFile);

/**
 * @swagger
 * /files/{fileId}/download:
 *   get:
 *     summary: Direct file download
 *     description: Download a file directly
 *     tags: [File Storage]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: expires
 *         schema:
 *           type: string
 *         description: Expiration timestamp for signed URL
 *       - in: query
 *         name: signature
 *         schema:
 *           type: string
 *         description: Signature for signed URL verification
 *     responses:
 *       200:
 *         description: File download started
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get('/:fileId/download', FileStorageController.downloadFile);

module.exports = router;
