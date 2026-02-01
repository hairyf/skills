---
name: encryption-hashing
description: Encryption and password hashing (bcrypt, argon2) for NestJS
---

# Encryption and Hashing

Nest uses Node.js built-in `crypto` for encryption. For password hashing, use bcrypt or argon2.

## Encryption (crypto)

```typescript
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const iv = randomBytes(16);
const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;

// Encrypt
const cipher = createCipheriv('aes-256-ctr', key, iv);
const encrypted = Buffer.concat([
  cipher.update(textToEncrypt),
  cipher.final(),
]);

// Decrypt
const decipher = createDecipheriv('aes-256-ctr', key, iv);
const decrypted = Buffer.concat([
  decipher.update(encrypted),
  decipher.final(),
]);
```

## Hashing (bcrypt)

```bash
npm i bcrypt
npm i -D @types/bcrypt
```

```typescript
import * as bcrypt from 'bcrypt';

// Hash password
const saltOrRounds = 10;
const hash = await bcrypt.hash(password, saltOrRounds);

// Generate salt
const salt = await bcrypt.genSalt();

// Verify
const isMatch = await bcrypt.compare(password, hash);
```

## Hashing (argon2)

```bash
npm i argon2
```

```typescript
import * as argon2 from 'argon2';

const hash = await argon2.hash(password);
const isMatch = await argon2.verify(hash, password);
```

## Injectable Hashing Service

```typescript
@Injectable()
export class HashingService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

## Key Points

- Use bcrypt or argon2 for passwords (argon2 preferred for new apps)
- Node.js `crypto` for encryption/decryption
- Never store plain passwords
- Use strong salts; bcrypt handles salt internally

<!--
Source references:
- https://docs.nestjs.com/security/encryption-and-hashing
-->
