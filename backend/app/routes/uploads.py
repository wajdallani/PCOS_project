import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
from .. import auth

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
# Remove /rest/v1/ if it exists in the URL for storage client
if url and url.endswith("/rest/v1/"):
    url = url.replace("/rest/v1/", "")
    
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"]
)

@router.post("/ultrasound")
async def upload_ultrasound(file: UploadFile = File(...)):
    try:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        file_content = await file.read()
        
        # Upload to "ultrasounds" bucket
        res = supabase.storage.from_("ultrasounds").upload(
            path=unique_filename,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        url_res = supabase.storage.from_("ultrasounds").get_public_url(unique_filename)
        
        return {"url": url_res}
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.post("/face-image")
async def upload_face_image(file: UploadFile = File(...)):
    try:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        file_content = await file.read()
        
        # Upload to "face-images" bucket
        res = supabase.storage.from_("face-images").upload(
            path=unique_filename,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        url_res = supabase.storage.from_("face-images").get_public_url(unique_filename)
        
        return {"url": url_res}
        
    except Exception as e:
        print(f"Face image upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload face image: {str(e)}")
