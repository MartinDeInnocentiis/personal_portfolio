from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    PERMISSION CLASS. ALLOWS TO EDIT/DELETE COMMENTS ONLY TO THEIR OWNERS.
    """

    def has_object_permission(self, request, view, obj):
        # READING PERMISSIONS ARE ALWAYS ALLOWED TO ANY REQUEST (GET, HEAD, OPTIONS)

        if request.method in permissions.SAFE_METHODS:
            return True
        
        #WRITING  ARE ONLY ALLOWED TO THE OWNER OF THAT COMMENT.
        
        return obj.user == request.user