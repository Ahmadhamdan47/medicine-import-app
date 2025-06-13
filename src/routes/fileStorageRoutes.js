// File Storage routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const FileStorageController = require('../controllers/fileStorageController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

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
