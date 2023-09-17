module.exports = async function (context, req) 
{
    const Crypto = require('crypto');
    context.log('JavaScript HTTP trigger function processed a request.');
    //Secure webhook payloads with a secret
    //default key is from function keys:
    const hmac = Crypto.createHmac("sha1", "DYuQMZcXwPnrShoVUJ0ts6r2LKLuGdtEiLg-LdUjODw2AzFug7vyaw==");
    const signature = hmac.update(JSON.stringify(req.body)).digest('hex');
    //prepends sha1= to the start of the key, so that it matches the format of x-hub-signature 
    const shaSignature = `sha1=${signature}`;
    //Add the following code to retrieve the GitHub signature from the request header:
    const gitHubSignature = req.headers['x-hub-signature'];
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    //Compare the two strings. If they match, process the request, as follows:
    if (!shaSignature.localeCompare(gitHubSignature)) 
    {
        if (req.body.pages[0].title){
            context.res = {
                body: "Page is " + req.body.pages[0].title + ", Action is " + req.body.pages[0].action + ", Event Type is " + req.headers['x-github-event']
            };
        }
        else {
            context.res = {
                status: 400,
                body: ("Invalid payload for Wiki event")
            };
        }
    }
    else
    {
        context.res = {
            status: 401,
            body: "Signatures don't match"
        };
    }
}
