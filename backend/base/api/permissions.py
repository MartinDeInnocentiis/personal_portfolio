from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    PERMISSION CLASS. ALLOWS TO EDIT/DELETE COMMENTS ONLY TO THEIR OWNERS.
    """

    def has_object_permission(self, request, view, obj):
        # READING PERMISSIONS ARE ALWAYS ALLOWED TO ANY REQUEST (GET, HEAD, OPTIONS)

        if request.method in permissions.SAFE_METHODS:
            return True
        
        # WRITING PERMISSIONS ARE ONLY ALLOWED TO THE OWNER OF THAT OBJ.
        # CHECKING IF THEY MATCH...
        if obj.user and obj.user == request.user:
            return True
        
        # ADDITIONAL CHECK FOR ANON_USERS.
        # THEY NEED TO STORE SOME ID AND PASS IT IN REQUEST.SESSION
        if obj.anon_user and 'anon_user_id' in request.session:
            return obj.anon_user.id == request.session['anon_user_id']

        return False