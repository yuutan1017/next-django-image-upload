from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Image
from .serializers import ImageSerializer


class RetrieveImageView(APIView):
  def get(self, request, format=None):
    try:
      if Image.objects.all().exists():
        images = Image.objects.all()
        images = ImageSerializer(images, many=True)
        return Response(
          {'images': images.data}, status=status.HTTP_200_OK
        )
        
      else:
        return Response(
          {'error' : 'No images found'}, status=status.HTTP_400_BAD_REQUEST
        )
        
    except:
      return Response(
        {'error': 'Something went wrong when retrieving images'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )
  
  
class UploadImageView(APIView):
  def post(self, request):
    try:
      data = self.request.data
      image = data['image']
      text = data['text']
      
      Image.objects.create(image=image, text=text)
      
      return Response(
        {'success': 'Image uploaded successfully'}, status=status.HTTP_201_CREATED
      )
      
    except:
      return Response(
        {'error': 'Something went wrong when uploading images'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )
