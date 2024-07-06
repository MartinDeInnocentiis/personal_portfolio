from rest_framework import permissions
import logging

logger = logging.getLogger(__name__)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    CUSTOM PERMISSION. ALLOWS TO MODIFY AND DELETE AN OBJECT ONLY TO ITS OWNER.
    """

    def has_object_permission(self, request, view, obj):
        
        if request.user.is_authenticated:
            return obj.user == request.user
        else:
            anon_user_id = request.session.get('anon_user_id')
            return str(obj.anon_user.id) == anon_user_id
        
        
        # # Permisos de lectura siempre están permitidos
        # if request.method in permissions.SAFE_METHODS:
        #     return True
        
        # # Permisos de escritura solo están permitidos al propietario del objeto
        # if obj.user and obj.user == request.user:
        #     return True
        
        # # Verificación adicional para usuarios anónimos
        # if obj.anon_user:
        #     anon_user_id = request.session.get('anon_user_id', None)
        #     logger.debug(f"anon_user_id en sesión: {anon_user_id}")
        #     logger.debug(f"anon_user.id: {obj.anon_user.id}")
        #     if anon_user_id and obj.anon_user.id == anon_user_id:
        #         return True

        # return False