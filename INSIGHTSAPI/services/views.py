"""Views for the services app."""
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .emails import send_email


@api_view(["POST"])
def send_report_ethical_line(request):
    """Send a report from the ethical line."""
    if not "complaint" in request.data:
        return Response({"error": "El tipo de denuncia es requerido"}, status=400)
    if not "description" in request.data:
        return Response(
            {"error": "La descripción de la denuncia es requerida"}, status=400
        )

    contact_info = ""
    if "contact_info" in request.data:
        contact_info = f"<p>El usuario desea ser contactado mediante:</p>{request.data['contact_info']}"
    errors = send_email(
        sender_user="mismetas",
        subject=f"Denuncia de {request.data['complaint']}",
        message=f"<p>{request.data['description']}</p>" + contact_info,
        to_emails=["heibert.mogollon@cyc-bpo.com"],
        html_content=True,
        email_owner="Línea ética",
        return_path="heibert.mogollon@cyc-bpo.com",
    )
    if errors:
        return Response({"error": "Hubo un error en el envió del correo"}, status=400)
    return Response({"message": "Correo enviado correctamente"}, status=200)
