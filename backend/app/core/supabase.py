from supabase import create_client, Client, ClientOptions
from app.core.config import settings

_client: Client | None = None


def get_supabase(token: str | None = None) -> Client:
    global _client
    if token:
        # Create a fresh client for authenticated requests to ensure RLS works correctly
        options = ClientOptions(headers={"Authorization": f"Bearer {token}"})
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY, options=options)
        return client

    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    return _client

def get_supabase_service_role() -> Client:
    if not getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None):
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY is not configured in the environment.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
