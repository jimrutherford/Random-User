function getRandomUser()
{
  var theUrl = [NSURL URLWithString:"http://api.randomuser.me/?sketch=true"];

  // define the request
  var theRequest = NSMutableURLRequest.requestWithURL_cachePolicy_timeoutInterval(theUrl, NSURLRequestReloadIgnoringLocalCacheData, 60);
  theRequest.setHTTPMethod_("GET");

  // get response data
  var theResponse = null, theResponseData = [NSURLConnection sendSynchronousRequest:theRequest returningResponse:nil error:nil];

  if (theResponseData!=nil) {

    // convert data to text
    theText = [[NSString alloc] initWithData:theResponseData encoding:NSUTF8StringEncoding];

    var parsed = JSON.parse(theText);
    user = parsed.results[0].user;
  }

  return user;
}


function insertRandomUser(profileLayer, user)
{
  text = [profileLayer name];

  // strip the prefix
  text = text.replace("profile:", "");

  text = text.replace("firstname", toTitleCase(user.name.first));
  text = text.replace("lastname", toTitleCase(user.name.last));

  text = text.replace("street", toTitleCase(user.location.street));
  text = text.replace("city", toTitleCase(user.location.city));
  text = text.replace("state", toTitleCase(user.location.state));
  text = text.replace("zip", toTitleCase(user.location.zip));

  text = text.replace("email", user.email);
  text = text.replace("phone", user.phone);
  text = text.replace("cell", user.cell);
  text = text.replace("username", user.username);

  [profileLayer setStringValue:text];
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
