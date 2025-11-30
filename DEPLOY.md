# 🚀 Guía de Despliegue - Galaxia para Monserrat

## Opción 1: Render (Recomendado)

### Paso 1: Preparar el repositorio
1. Crea un repositorio en GitHub
2. Sube todos los archivos del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/galaxia.git
   git push -u origin main
   ```

### Paso 2: Desplegar en Render
1. Ve a [render.com](https://render.com) y crea una cuenta
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `galaxia-monserrat` (o el nombre que prefieras)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: `Free`
5. Click en "Create Web Service"
6. Espera 2-3 minutos y tu app estará en línea 🎉

### URL Final
Tu app estará disponible en: `https://galaxia-monserrat.onrender.com`

---

## Opción 2: Railway

### Pasos:
1. Ve a [railway.app](https://railway.app)
2. Conecta tu GitHub
3. Click en "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Railway detectará automáticamente que es Flask
6. ¡Listo! URL disponible en ~2 minutos

---

## Opción 3: PythonAnywhere

### Pasos:
1. Crea cuenta en [pythonanywhere.com](https://www.pythonanywhere.com)
2. Ve a "Web" → "Add a new web app"
3. Selecciona "Flask" y Python 3.10
4. Sube tus archivos vía "Files" o Git
5. Configura el WSGI file apuntando a `app.py`
6. Reload la app

---

## 📝 Notas Importantes

### Archivos necesarios (ya creados):
- ✅ `requirements.txt` - Dependencias Python
- ✅ `Procfile` - Comando de inicio para Render/Railway
- ✅ `app.py` - Tu aplicación Flask

### Limitaciones del plan gratuito:
- **Render**: Se duerme después de 15 min sin uso (tarda ~30s en despertar)
- **Railway**: $5 de crédito mensual (suficiente para uso moderado)
- **PythonAnywhere**: Siempre activo pero con dominio `.pythonanywhere.com`

### Recomendación:
**Usa Render** si quieres algo rápido y fácil. Es perfecto para este tipo de proyectos.

---

## 🔧 Troubleshooting

Si tienes problemas:
1. Verifica que `requirements.txt` esté en la raíz del proyecto
2. Asegúrate de que `app.py` tenga `if __name__ == '__main__':`
3. Revisa los logs en el dashboard de Render

## 🎨 Personalización

Para cambiar el dominio:
- **Render**: Puedes agregar un dominio personalizado gratis
- **Railway**: Igual, dominio personalizado disponible
- **PythonAnywhere**: Solo en plan pago

---

¡Buena suerte con el despliegue! 🚀
