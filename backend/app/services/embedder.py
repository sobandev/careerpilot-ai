from typing import List, Tuple
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    _model = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_TRANSFORMERS = True
except Exception:
    HAS_TRANSFORMERS = False
    _model = None


def get_embedding(text: str) -> List[float]:
    """Generate embedding for text."""
    if HAS_TRANSFORMERS and _model:
        emb = _model.encode([text])[0]
        return emb.tolist()
    # Fallback: return zeros
    return [0.0] * 384


def compute_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    if not vec1 or not vec2:
        return 0.0
    a = np.array(vec1).reshape(1, -1)
    b = np.array(vec2).reshape(1, -1)
    return float(cosine_similarity(a, b)[0][0])
