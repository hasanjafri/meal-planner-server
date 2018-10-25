const DEFAULT_ERROR_MESSAGE = `Sorry, something went wrong. We couldn't process your request.`;

function jsonErr(res, err=DEFAULT_ERROR_MESSAGE, status=400) {
    console.log(err);
    return res.status(status).json({message: err})
};

function jsonSuccess(res, data={}, status=true) {
    return res.status(200).json({
        success: status,
        data
    });
};

export { jsonErr, jsonSuccess };