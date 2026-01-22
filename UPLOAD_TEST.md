# ============================================
# ENDPOINT DE CARGA DE IMÁGENES
# ============================================

# Endpoint: POST /api/upload
# Descripción: Sube una imagen al servidor mediante Multipart/Form-Data
# Almacenamiento: Físico en disco en la carpeta ./uploads
# Respuesta: JSON con la URL relativa del archivo guardado

# ============================================
# COMANDO cURL PARA PRUEBAS
# ============================================

# IMPORTANTE: Reemplaza "/ruta/a/tu/imagen.png" con la ruta real de tu imagen
# Ejemplo en Windows: C:/Users/usuario/Pictures/foto.jpg
# Ejemplo en Linux/Mac: /home/usuario/imagenes/foto.png

curl -X POST http://localhost:3000/api/upload \
  -F "image=@/ruta/a/tu/imagen.png"

# ============================================
# EJEMPLOS DE USO
# ============================================

# Ejemplo 1: Subir una imagen PNG
curl -X POST http://localhost:3000/api/upload \
  -F "image=@C:/Users/arlet/Pictures/mi_foto.png"

# Ejemplo 2: Subir una imagen JPG
curl -X POST http://localhost:3000/api/upload \
  -F "image=@C:/Users/arlet/Desktop/imagen.jpg"

# Ejemplo 3: Con headers adicionales (opcional)
curl -X POST http://localhost:3000/api/upload \
  -H "Accept: application/json" \
  -F "image=@C:/Users/arlet/Downloads/foto.jpeg"

# ============================================
# RESPUESTA ESPERADA (ÉXITO)
# ============================================

# Status: 200 OK
# Body:
{
  "success": true,
  "message": "Imagen subida exitosamente",
  "data": {
    "url": "/uploads/mi_foto-1737510000000-123456789.png",
    "filename": "mi_foto-1737510000000-123456789.png",
    "originalName": "mi_foto.png",
    "mimetype": "image/png",
    "size": 245678
  }
}

# ============================================
# RESPUESTA DE ERROR (SIN ARCHIVO)
# ============================================

# Status: 400 Bad Request
# Body:
{
  "success": false,
  "message": "No se recibió ningún archivo"
}

# ============================================
# RESPUESTA DE ERROR (TIPO NO PERMITIDO)
# ============================================

# Status: 500 Internal Server Error
# Body:
{
  "message": "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, BMP)"
}

# ============================================
# NOTAS IMPORTANTES
# ============================================

# 1. El campo del formulario DEBE llamarse "image" (no "file")
# 2. La sintaxis -F "image=@/ruta" es CRÍTICA para Postman/Insomnia
# 3. El arroba (@) indica que es un archivo binario
# 4. Los archivos se guardan en: ./uploads/
# 5. Límite de tamaño: 5MB
# 6. Formatos permitidos: JPEG, JPG, PNG, GIF, WebP, BMP
# 7. Los nombres de archivo son únicos (timestamp + random)

# ============================================
# IMPORTAR EN POSTMAN/INSOMNIA
# ============================================

# Para importar este comando en Postman:
# 1. Abre Postman
# 2. Click en "Import" (esquina superior izquierda)
# 3. Selecciona "Raw text"
# 4. Pega el comando cURL
# 5. Click en "Continue" y luego "Import"
# 6. Postman reconocerá automáticamente el archivo binario

# Para Insomnia:
# 1. Abre Insomnia
# 2. Click en el menú dropdown junto al workspace
# 3. Selecciona "Import/Export" > "Import Data" > "From Clipboard"
# 4. Pega el comando cURL
# 5. Click en "Import"
