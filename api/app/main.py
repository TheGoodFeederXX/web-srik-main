from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from PIL import Image
import os
import ffmpeg
from datetime import datetime
import io
import uuid

app = Flask(__name__)
CORS(app)

# Enable debug logging
app.logger.setLevel('DEBUG')

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'webm', 'mov'}
MAX_CONTENT_LENGTH = 1000 * 1024 * 1024  # 1000MB max file size

def allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

def allowed_video(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS

def create_thumbnail(image_path, thumbnail_path, size=(400, 300)):
    with Image.open(image_path) as img:
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        # Create thumbnail
        img.thumbnail(size)
        img.save(thumbnail_path, 'JPEG', quality=85)

def create_video_thumbnail(video_path, thumbnail_path):
    try:
        # Extract first frame using ffmpeg
        probe = ffmpeg.probe(video_path)
        duration = float(probe['streams'][0]['duration'])
        timestamp = min(duration * 0.1, 3.0)  # Take frame at 10% or 3 seconds, whichever is shorter
        
        (
            ffmpeg
            .input(video_path, ss=timestamp)
            .filter('scale', 400, -1)
            .output(thumbnail_path, vframes=1)
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
        return True
    except ffmpeg.Error as e:
        print(f"Error creating video thumbnail: {e.stderr.decode()}")
        return False

def generate_filename(original_filename):
    ext = original_filename.rsplit('.', 1)[1].lower()
    return f"{datetime.now().strftime('%Y%m%d')}_{str(uuid.uuid4())[:8]}.{ext}"

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    files = request.files.getlist('files[]')
    response = []
    
    for file in files:
        if file.filename == '':
            continue
            
        if file and (allowed_image(file.filename) or allowed_video(file.filename)):
            filename = generate_filename(file.filename)
            is_video = allowed_video(file.filename)
            
            # Determine save path
            file_path = os.path.join(UPLOAD_FOLDER, 'videos' if is_video else 'images', filename)
            thumbnail_path = os.path.join(UPLOAD_FOLDER, 'thumbnails', f"thumb_{filename}.jpg")
            
            # Save original file
            file.save(file_path)
            
            # Create thumbnail
            if is_video:
                thumbnail_success = create_video_thumbnail(file_path, thumbnail_path)
            else:
                create_thumbnail(file_path, thumbnail_path)
                thumbnail_success = True
            
            # Generate URLs
            base_url = request.host_url.rstrip('/')
            file_url = f"{base_url}/media/{'videos' if is_video else 'images'}/{filename}"
            thumbnail_url = f"{base_url}/media/thumbnails/thumb_{filename}.jpg" if thumbnail_success else None
            
            response.append({
                'success': True,
                'urls': {
                    'original': file_url,
                    'thumbnail': thumbnail_url
                },
                'filename': filename,
                'type': 'video' if is_video else 'image'
            })
        else:
            response.append({
                'success': False,
                'error': 'File type not allowed',
                'filename': file.filename
            })
    
    return jsonify(response)

@app.route('/media/<path:filename>')
def serve_file(filename):
    if filename.startswith(('images/', 'videos/', 'thumbnails/')):
        directory = filename.split('/')[0]
        filename = filename.split('/', 1)[1]
        return send_from_directory(os.path.join(UPLOAD_FOLDER, directory), filename)
    return 'File not found', 404

@app.route('/delete/<path:filename>', methods=['DELETE'])
def delete_file(filename):
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
        
    try:
        # Delete original file
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # Delete thumbnail if exists
        thumb_path = os.path.join(UPLOAD_FOLDER, 'thumbnails', f"thumb_{filename}.jpg")
        if os.path.exists(thumb_path):
            os.remove(thumb_path)
            
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Ensure upload directories exist
    os.makedirs(os.path.join(UPLOAD_FOLDER, 'images'), exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_FOLDER, 'videos'), exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_FOLDER, 'thumbnails'), exist_ok=True)
    
    app.run(debug=True, port=5000)
