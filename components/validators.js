
exports.userValidator = function(name, username, password) {
  const specialChars = /[ <>]/
  if (specialChars.test(name) == true || name == null) {
    return false
  }
  if (specialChars.test(username) == true || username == null) {
     return false
  }
  if (specialChars.test(password) == true || password == null) {
     return false
  }
  return true;
}

exports.postValidator = function(title, text) {
  const specialChars = /[<>]/
  if (specialChars.test(title) == true || title == null) {
    return false 
  }
  if (specialChars.test(text) == true || text == null) {
     return false
  }
  return true;
}

