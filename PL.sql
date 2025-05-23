-- # Citation for the following stored procedures:
-- # Date: 05/20/2025
-- # Adapted from Exploration - Implementing CUD operations in your app
-- # Source URL: https://oregonstate.instructure.com/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968

-- #############################
-- CREATE appointmentServices
-- #############################
DROP PROCEDURE IF EXISTS sp_InsertAppointmentService;
DELIMITER //
CREATE PROCEDURE sp_InsertAppointmentService (
    IN p_serviceId INT,
    IN p_appointmentId INT,
    OUT p_resultStatus INT
)
BEGIN
    INSERT INTO AppointmentServices (serviceId, appointmentId)
    VALUES (p_serviceId, p_appointmentId);
    IF ROW_COUNT() > 0 THEN
        SET p_resultStatus = 1;
    ELSE SET p_resultStatus = 0;
    END IF;
END //
DELIMITER ;

-- #############################
-- UPDATE appointmentServices
-- #############################
DROP PROCEDURE IF EXISTS sp_UpdateAppointmentService;
DELIMITER //
CREATE PROCEDURE sp_UpdateAppointmentService(
    IN p_oldServiceId INT,
    IN p_newServiceId INT,
    IN p_appointmentId INT,
    OUT p_resultStatus INT
)
BEGIN
    UPDATE AppointmentServices
        SET serviceId = p_newServiceId
            WHERE appointmentId = p_appointmentId
            AND serviceId = p_oldServiceId; 
END //
DELIMITER ;

-- #############################
-- DELETE AppointmentServices
-- #############################
DROP PROCEDURE IF EXISTS sp_DeleteAppointmentService;
DELIMITER //
CREATE PROCEDURE sp_DeleteAppointmentService(
    IN p_appointmentId INT,
    IN p_serviceId INT,
    OUT p_resultStatus INT
)
BEGIN
    DECLARE error_message VARCHAR(255); 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        DELETE FROM AppointmentServices
            WHERE appointmentId = p_appointmentId
            AND serviceId = p_serviceId;

        IF ROW_COUNT() = 1 THEN
            SET p_resultStatus = 1;
        ELSE 
            SET p_resultStatus = 0;
            SET error_message = CONCAT('No matching record found in appointmentservices for ids (appointment, service): ', p_appointmentId, p_serviceId);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //
DELIMITER ;