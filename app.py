from flask import Flask, render_template

app = Flask(__name__)

# Frases quemadas en el código como solicitó el usuario
FRASES = [
    "Contigo no quiero finales felices; quiero infinitos reales.",
    "Eres la casualidad mas bonita que jamas planee.",
    "Si tu supieras lo que siento, vendrias corriendo… o yo iria primero.",
    "Me gustas. Asi, sin poesia… pero con toda la intencion.",
    "Tu sonrisa es mi argumento favorito para creer en los dias buenos.",
    "Quisiera ser el motivo por el que te brillan los ojos.",
    "Si estar contigo es un error, no pienso corregirme.",
    "Me gustas mas de lo que deberia y menos de lo que quiero.",
    "No eres mi tipo… eres mucho mas que eso.",
    "Te pienso sin permiso, y te extrano sin aviso.",
    "Ojala te quedes… pero si no, igual gracias por hacerme sentir.",
    "Con un mensaje tuyo el mundo vuelve a tener sentido.",
    "Cuando te miro, el resto es ruido.",
    "Quisiera coincidir contigo tantas veces que el destino se canse.",
    "Tu abrazo es el unico lugar al que quiero llegar tarde y quedarme siempre.",
    "Si tu fueras duda, yo seria respuesta.",
    "No se si eres mi destino, pero si eres mi direccion favorita.",
    "A veces te imagino… y otras veces te extrano por adelantado.",
    "No me enamoras; me hackeas el alma.",
    "Te quiero aqui, en mi presente… y si quieres, tambien en mi futuro.",
    "Que lindo seria coincidir sin prisa y mirarnos sin miedo.",
    "Lo que siento por ti no cabe en un mensaje, pero igual te lo mando.",
    "No se que somos, pero se que no quiero que seamos nada menos.",
    "Me gustas como para escribirte, leerte y elegirte.",
    "Si el amor fuera impulso, contigo seria inevitabilidad.",
    "Te pienso tanto que ya casi somos una historia.",
    "Me basta tu mirada para entender por que vale la pena arriesgarse.",
    "Si tu estas, todo encaja. Y si no, todo falta.",
    "Eres la persona que aparece en todas mis versiones del futuro.",
    "Lo nuestro no se que sera… pero se que quiero averiguarlo contigo."
]


@app.route('/')
def galaxia():
    # Renderizamos directamente la galaxia pasando las frases
    return render_template('galaxia.html', frases=FRASES)

if __name__ == '__main__':
    app.run(debug=True)

# Vercel handler
handler = app
