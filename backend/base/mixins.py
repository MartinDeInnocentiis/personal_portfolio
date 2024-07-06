from django.http import JsonResponse
import uuid
from .models import Anon_User
from django.utils.crypto import get_random_string
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError as ValidationErrorDRF

class AnonUserInteractionMixin:
    def handle_anon_user(self, request):
        if request.user.is_authenticated:
            return request.user, None
        else:
            anon_user, created = Anon_User.objects.get_or_create(
                id=request.session.get('anon_user_id', uuid.uuid4())
            )
            if created:
                anon_user.name = f"Anonymous_{get_random_string(8)}"
                anon_user.save()
                request.session['anon_user_id'] = str(anon_user.id)
            return None, anon_user
        
        
class ReactionCountMixin:
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total_reactions = queryset.count()
        serializer = self.get_serializer(queryset, many=True)
        response_data = {
            "total_reactions": total_reactions,
            "reactions": serializer.data
        }
        return Response(response_data)
    
    
class PreventDuplicateReactionMixin(AnonUserInteractionMixin):
    reaction_model = None

    def check_duplicate_reaction(self, request, **kwargs):
        user, anon_user = self.handle_anon_user(request)

        # Determine the filter parameters dynamically based on kwargs
        filter_params = {key: value for key, value in kwargs.items() if key in ['post_id', 'comment_id']}
        
        # Check if the user or anonymous user has already reacted
        if user:
            existing_reaction = self.reaction_model.objects.filter(user=user, **filter_params).exists()
        else:
            existing_reaction = self.reaction_model.objects.filter(anon_user=anon_user, **filter_params).exists()
        
        if existing_reaction:
            raise ValidationErrorDRF("You have already reacted to this item.")

        return user, anon_user
    
        
    # def handle_anon_user(self, request):
    #     if request.user.is_authenticated:
    #         return request.user, None

    #     anon_user_id = request.session.get('anon_user_id') or str(uuid.uuid4())
    #     request.session['anon_user_id'] = anon_user_id
    #     anon_user, created = Anon_User.objects.get_or_create(id=anon_user_id)
    #     return None, anon_user

    # def create_interaction_response(self, success=True, anon_user_id=None):
    #     response_data = {
    #         'status': 'success' if success else 'failure',
    #     }
    #     if anon_user_id:
    #         response_data['anon_user_id'] = anon_user_id
    #     return JsonResponse(response_data)