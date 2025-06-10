// Updates a service tied to a specific appointment
function updateService(appointmentId, oldServiceId, newServiceId) {
    try {
        fetch(
            `/appointments/${appointmentId}/service/${oldServiceId}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newServiceId })
            }
        )
        .then(result => {
            if (result.status >= 400)
                window.location.reload();
        });
    } 
    catch (_) { window.location.reload(); }
}

// Deletes a service tied to a specific appointment
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
