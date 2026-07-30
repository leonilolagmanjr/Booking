const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    eager: [{ width: 320, height: 180, crop: 'crop', gravity: 'auto' }],
  },
});

const upload = multer({ storage });

router.post('/upload', authenticate(), upload.single('video'), videoController.uploadVideo);
router.get('/', videoController.getVideos);
router.get('/my-videos', authenticate(), videoController.getUserVideos);
router.get('/:id', videoController.getVideo);
router.patch('/:id', authenticate(), videoController.updateVideo);
router.delete('/:id', authenticate(), videoController.deleteVideo);

module.exports = router;
