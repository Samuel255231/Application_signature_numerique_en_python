from cryptography.hazmat.primitives.asymmetric import rsa

# Géneration clé privé

private_keys = rsa.generate_private_key(
    public_exponent = 65537,
    key_size = 2048
)

# Géneration clé public

public_keys = private_keys.public_key()