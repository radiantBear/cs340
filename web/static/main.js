function deleteService(appointmentId, serviceId) {
    try {
        fetch(
            `/appointments/${appointmentId}/services/${serviceId}`,
            { method: 'DELETE' }
        )
        .then(() => { window.location.reload(); });
    } 
    catch (_) { }
}
