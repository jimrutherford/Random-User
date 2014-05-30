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
  if (profileLayer.class() === MSTextLayer)
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
  else if (profileLayer.class() === MSBitmapLayer)
  {
    insertProfilePicture(profileLayer, user);
  }
}

function insertProfilePicture(profileLayer, user)
{
  var urlString = user.picture;
  var imageURL = [NSURL URLWithString:urlString];

  var imageFromURL = [[NSImage alloc] initWithContentsOfURL:imageURL];

  var imageLayer;
  var imageCollection;

  if (profileLayer.class() === MSBitmapLayer)
  {
    // updating an existing layer
    [profileLayer setIsVisible:false];
    imageCollection = [[profileLayer documentData] images];
    var image = [imageCollection addImage:imageFromURL name:"profilePicture" convertColourspace:false];
    [profileLayer setPrimitiveImage:image];
    [profileLayer setIsVisible:true];
  } else {
    // creating a new profile picture
    imageCollection = [[MSImageCollection alloc] init];
    var image = [imageCollection addImage:imageFromURL name:"profilePicture" convertColourspace:false];
    imageLayer = [[MSBitmapLayer alloc] initWithImage:image parentFrame:[profileLayer frame] name:"profile:picture"];

    if (imageLayer)
    {
      //log ("Got Image Data");

      [profileLayer addLayer:imageLayer];

      var layerFrame = [imageLayer frame];

      [layerFrame setX:0];
      [layerFrame setY:0];

      [layerFrame setConstrainProportions: false];
      [layerFrame setHeight: 200];
      [layerFrame setWidth: 200];
      [layerFrame setConstrainProportions: true];

    }
  }
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
