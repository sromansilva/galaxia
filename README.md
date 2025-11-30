# 🌌 Galaxia - Dedicado a Monserrat

Una experiencia interactiva 3D creada con Flask y Three.js que muestra frases románticas orbitando alrededor de un sol central.

## ✨ Características

- 🎨 Escena 3D interactiva con Three.js
- ☄️ Lluvia de meteoritos animada
- 💫 Frases con animaciones de entrada escalonadas
- 🌟 Más de 4000 estrellas de fondo
- 🎯 Órbitas organizadas y compactas
- 🎨 Colores vibrantes y efectos de brillo

## 🚀 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/galaxia.git
cd galaxia

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar la aplicación
python app.py
```

Abre tu navegador en `http://localhost:5000`

## 📦 Tecnologías

- **Backend**: Flask (Python)
- **Frontend**: Three.js, HTML5, CSS3
- **Despliegue**: Render / Railway / PythonAnywhere

## 🌐 Despliegue

Ver [DEPLOY.md](DEPLOY.md) para instrucciones detalladas de despliegue.

## 📝 Estructura del Proyecto

```
galaxia/
├── app.py                 # Aplicación Flask
├── requirements.txt       # Dependencias Python
├── Procfile              # Configuración para Render
├── templates/
│   └── galaxia.html      # Template principal
├── static/
│   ├── css/
│   │   └── styles.css    # Estilos
│   └── js/
│       └── galaxia.js    # Lógica 3D
└── data/
    └── frases.json       # (Opcional) Datos de frases
```

## 🎮 Controles

- **Arrastrar**: Rotar la cámara
- **Scroll**: Zoom in/out
- **Click**: Interactuar con frases (próximamente)

## 💝 Créditos

Creado con amor para Monserrat ✨

---

**Nota**: Este proyecto usa CDN para Three.js, por lo que requiere conexión a internet para funcionar correctamente.
