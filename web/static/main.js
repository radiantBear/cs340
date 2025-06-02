function deleteService(appointmentId, serviceId, successUrl, failUrl) {
    try {
        fetch(
            `/appointments/${appointmentId}/services/${serviceId}`,
            {
                method: 'DELETE'
            }
        )
        .then(result => {
            if (result.status >= 400)
                window.location.href = failUrl;
            
            window.location.href = successUrl;
        });

    } 
    catch (_) {
        window.location.href = failUrl;
    }
}