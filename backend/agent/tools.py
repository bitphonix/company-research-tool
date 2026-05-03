import asyncio

from tavily import TavilyClient


def _build_client() -> TavilyClient:
    import os
    api_key = os.environ["TAVILY_API_KEY"]
    return TavilyClient(api_key=api_key)


async def search(query: str, max_results: int = 5) -> list[dict]:
    client = _build_client()

    def _sync_search() -> list[dict]:
        response = client.search(query=query, max_results=max_results)
        results = response.get("results", [])
        return [
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "content": r.get("content", ""),
            }
            for r in results if r.get("content")
        ]

    return await asyncio.to_thread(_sync_search)
