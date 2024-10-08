from django.http import JsonResponse
import uuid
from .models import Anon_User
from django.utils.crypto import get_random_string
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError as ValidationErrorDRF

class AnonUserInteractionMixin:
    def handle_anon_user(self, request, anon_username=None):
        if request.user.is_authenticated:
            return request.user, None
        
        # Obtener el anon_user_id desde la cabecera o la sesión
        anon_user_id = request.headers.get('X-Anon-User-ID') or request.session.get('anon_user_id')
        
        if anon_user_id:
            try:
                # Intentar recuperar el Anon_User existente
                anon_user = Anon_User.objects.get(id=anon_user_id)
            except Anon_User.DoesNotExist:
                # Si no existe, crear un nuevo Anon_User con ese ID
                anon_user = Anon_User.objects.create(id=anon_user_id, name=anon_username or f"Anonymous_{get_random_string(8)}")
                request.session['anon_user_id'] = str(anon_user.id)
                request.session.save()
        else:
            # Si no hay anon_user_id, crear uno nuevo
            anon_user = Anon_User.objects.create(name=anon_username or f"Anonymous_{get_random_string(8)}")
            request.session['anon_user_id'] = str(anon_user.id)
            request.session.save()
        
        return None, anon_user
    #25/8
    # def handle_anon_user(self, request, anon_username=None):
    #     # Si el usuario está autenticado, devolverlo junto con un None para anon_user
    #     if request.user.is_authenticated:
    #         return request.user, None
        
    #     # Obtener el anon_user_id de las cabeceras (o sesión)
    #     anon_user_id = request.headers.get('X-Anon-User-ID') or request.session.get('anon_user_id')
        
    #     if anon_user_id:
    #         # Si ya existe, cargar ese anon_user
    #         anon_user = Anon_User.objects.get(id=anon_user_id)
    #     else:
    #         # Si no existe, crearlo
    #         anon_user = Anon_User.objects.create(name=anon_username or f"Anonymous_{get_random_string(8)}")
    #         request.session['anon_user_id'] = str(anon_user.id)  # Guardar en la sesión
    #         request.session.save()
        
    #     return None, anon_user
    
    #24/8 A LA NOCHE SE COMENTÓ ESTO Y SE DESARROLLÓ UIN NUEVO METODO (SE GENRAN NUEVOS ANON_USER EN CADA INTERACCION CON ESTE)
    # def handle_anon_user(self, request, anon_user_data=None):
    #     if request.user.is_authenticated:
    #         return request.user, None
    #     else:
    #         anon_user_id = anon_user_data.get('id') if anon_user_data else None
    #         anon_username = anon_user_data.get('name') if anon_user_data else None
            
    #         if anon_user_id:
    #             # Recuperar el Anon_User existente basado en el ID enviado desde el frontend
    #             anon_user, created = Anon_User.objects.get_or_create(id=anon_user_id)
    #             if anon_username and anon_user.name != anon_username:
    #                 anon_user.name = anon_username
    #                 anon_user.save()
    #         else:
    #             # Crear un nuevo Anon_User si no hay ID proporcionado
    #             anon_user = Anon_User.objects.create(name=anon_username or f"Anonymous_{get_random_string(8)}")
    #             request.session['anon_user_id'] = str(anon_user.id)  
    #             request.session.save()
            
    #         return None, anon_user
    
    
    
    
    # def handle_anon_user(self, request, anon_username=None):
    #     if request.user.is_authenticated:
    #         return request.user, None
    #     else:
    #         anon_user_id = request.session.get('anon_user_id')
    #         if not anon_user_id:
    #             anon_user = Anon_User.objects.create(name=anon_username or f"Anonymous_{get_random_string(8)}")
    #             request.session['anon_user_id'] = str(anon_user.id)  
    #             request.session.save()  
    #         else:
    #             anon_user = Anon_User.objects.get(id=anon_user_id)
    #             if anon_username:
    #                 anon_user.name = anon_username
    #                 anon_user.save()
    #         return None, anon_user
        
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
        
        #if existing_reaction:
        #    raise ValidationErrorDRF("You have already reacted to this item.")

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