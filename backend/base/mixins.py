from django.http import JsonResponse
import uuid
from .models import Anon_User

class AnonUserInteractionMixin:
    def handle_anon_user(self, request):
        if request.user.is_authenticated:
            return request.user, None  

        anon_user_id = request.session.get('anon_user_id') or str(uuid.uuid4())
        request.session['anon_user_id'] = anon_user_id 
        anon_user, created = Anon_User.objects.get_or_create(id=anon_user_id)
        return None, anon_user

    def create_interaction_response(self, success=True, anon_user_id=None):
        response_data = {
            'status': 'success' if success else 'failure',
        }
        if anon_user_id:
            response_data['anon_user_id'] = anon_user_id
        return JsonResponse(response_data)