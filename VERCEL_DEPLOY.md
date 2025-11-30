# 🚀 Despliegue en Vercel - Galaxia para Monserrat

## ¿Por qué Vercel?
- ✅ **Totalmente gratuito** para proyectos personales
- ✅ **Despliegue instantáneo** desde GitHub
- ✅ **HTTPS automático**
- ✅ **Dominio personalizado gratis**
- ✅ **Sin "sleep mode"** - siempre activo
- ✅ **CDN global** - súper rápido en todo el mundo

---

## 📋 Pasos para Desplegar

### 1. Preparar el Repositorio en GitHub

```bash
# Inicializa Git (si no lo has hecho)
git init

# Agrega todos los archivos
git add .

# Haz el primer commit
git commit -m "Preparado para Vercel"

# Crea el repositorio en GitHub y conecta
git branch -M main
git remote add origin https://github.com/TU_USUARIO/galaxia.git
git push -u origin main
```

### 2. Desplegar en Vercel

#### Opción A: Desde la Web (Más Fácil)
1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Sign Up"** y usa tu cuenta de GitHub
3. Click en **"Add New..."** → **"Project"**
4. Selecciona tu repositorio `galaxia`
5. Vercel detectará automáticamente que es Python/Flask
6. Click en **"Deploy"**
7. ¡Espera 1-2 minutos y listo! 🎉

#### Opción B: Desde la Terminal (Para Expertos)
```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel

# Sigue las instrucciones en pantalla
```

### 3. Obtener tu URL

Después del despliegue, Vercel te dará una URL como:
```
https://galaxia-monserrat.vercel.app
```

---

## 🔧 Archivos de Configuración Creados

### `vercel.json`
Configuración principal de Vercel. Le dice cómo ejecutar tu app Flask.

### `app.py` (modificado)
Se agregó `handler = app` al final para compatibilidad con Vercel.

### `requirements.txt`
Lista de dependencias Python que Vercel instalará automáticamente.

---

## 🎨 Personalización

### Cambiar el Nombre del Proyecto
1. En Vercel Dashboard → Settings → General
2. Cambia "Project Name"
3. Tu URL cambiará a `https://NUEVO-NOMBRE.vercel.app`

### Agregar Dominio Personalizado (Gratis)
1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio (ej: `galaxia.tudominio.com`)
3. Configura los DNS según las instrucciones
4. ¡Listo! HTTPS incluido automáticamente

---

## 🔄 Actualizaciones Automáticas

Cada vez que hagas `git push` a tu repositorio, Vercel:
1. Detecta el cambio automáticamente
2. Despliega la nueva versión
3. ¡Tu app se actualiza en ~1 minuto!

```bash
# Hacer cambios
git add .
git commit -m "Actualización de frases"
git push

# Vercel despliega automáticamente 🚀
```

---

## 📊 Monitoreo

En el Dashboard de Vercel puedes ver:
- 📈 Analytics (visitas, rendimiento)
- 📝 Logs en tiempo real
- 🌍 Tráfico por región
- ⚡ Velocidad de carga

---

## ⚠️ Limitaciones del Plan Gratuito

- ✅ **Bandwidth**: 100GB/mes (más que suficiente)
- ✅ **Builds**: Ilimitados
- ✅ **Dominios**: Ilimitados
- ✅ **Proyectos**: Ilimitados
- ⚠️ **Serverless Functions**: 100GB-Hrs/mes (suficiente para uso personal)

---

## 🆘 Troubleshooting

### Error: "Build Failed"
- Verifica que `requirements.txt` esté correcto
- Asegúrate de que `vercel.json` esté en la raíz del proyecto

### Error: "500 Internal Server Error"
- Revisa los logs en Vercel Dashboard → Deployments → [tu deployment] → Logs
- Verifica que todas las rutas en `app.py` funcionen correctamente

### La app carga pero no se ven las frases
- Verifica que `FRASES` esté definido en `app.py`
- Revisa la consola del navegador (F12) para errores de JavaScript

---

## 🎯 Ventajas de Vercel vs Otras Opciones

| Característica | Vercel | Render | Railway |
|---------------|--------|--------|---------|
| Precio | Gratis | Gratis | $5/mes crédito |
| Sleep Mode | ❌ No | ✅ Sí (15 min) | ❌ No |
| Velocidad | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ |
| Dominio Custom | ✅ Gratis | ✅ Gratis | ✅ Gratis |
| Auto Deploy | ✅ | ✅ | ✅ |
| CDN Global | ✅ | ❌ | ❌ |

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Consulta la [documentación de Vercel](https://vercel.com/docs)
3. Verifica que todos los archivos estén en GitHub

---

## ✨ Próximos Pasos

Una vez desplegado:
1. Comparte la URL con Monserrat 💝
2. Monitorea las visitas en Vercel Analytics
3. Agrega un dominio personalizado si quieres

¡Disfruta tu galaxia en producción! 🌌✨
