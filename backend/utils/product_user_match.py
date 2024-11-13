def calculate_product_match(user_keywords, product_keywords):
    if len(user_keywords) < 1:
        return 0

    user_keywords = [x.lower() for x in user_keywords]
    product_keywords = [x.lower() for x in product_keywords]

    matches = 0

    for keyword in user_keywords:
        if keyword in product_keywords:
            matches = matches + 1

    return round((matches / len(product_keywords)) * 100)