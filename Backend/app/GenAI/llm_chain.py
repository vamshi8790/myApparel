from ollama import chat
import json

class ProductChain:
    def __init__(self):
        self.product_data = []

    def load_data(self, products):
        self.product_data = [
            {"id": str(p["id"]), "name": p["name"], "category": p["category"], "price": p["price"]}
            for p in products
        ]

    def predict(self, user_data):
        """Return a generator yielding suggestions one by one"""
        minimal_user_data = {
            "cart": [{"product_name": i.get("product_name"), "category": i.get("category")} for i in user_data.get("cart", [])],
            "orders": [{"product_name": o.get("product_name"), "category": o.get("category")} for o in user_data.get("orders", [])],
        }

        prompt = f"""
        You are a shopping assistant. Suggest 5 relevant products based on:
        USER DATA: {json.dumps(minimal_user_data)}
        AVAILABLE PRODUCTS: {json.dumps(self.product_data[:50])}
        Output JSON: [{{"id": "...", "name": "...", "reason": "..."}}]
        """

        response = chat(model="phi3", messages=[{"role": "user", "content": prompt}])
        content = response.get("message", {}).get("content", "")
        try:
            suggestions = json.loads(content)
        except:
            suggestions = [{"suggestion": content}]
        for s in suggestions:
            yield json.dumps(s) + "\n"

product_chain = ProductChain()
