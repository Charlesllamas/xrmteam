function currentUserHasRole(roleName){
    var hasRole = false;
    var userRolesKey = "userRoles_" + Xrm.Utility.getGlobalContext().userSettings.userId;
    //validate if role names are already in cache
    var userRoles = JSON.parse(sessionStorage.getItem(userRolesKey));
    if (typeof (userRoles) === "undefined" || userRoles === null)
       userRoles = retrieveUserRoles();
    userRoles.forEach(function(name) {
        if (name.toLowerCase() == roleName.toLowerCase())
            hasRole = true;
    });
    return hasRole;
};


function retrieveUserRoles(){
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;
    var userRolesKey = "userRoles_" + userSettings.userId;
    var userRoles = [];
    var securityRoles = userSettings.securityRoles;
    for (var i = 0; i < securityRoles.length; i++) {
        var role = retrieveRecordSync( "roles", securityRoles[i], "name");
        if(role)
            userRoles[i] = role.name;
    }
    //store the role names in cache
    sessionStorage.setItem(userRolesKey, JSON.stringify(userRoles));
    return userRoles;
};


function retrieveRecordSync(entityName,id,attributes) {
    try {
        var envUrl = Xrm.Utility.getGlobalContext().getClientUrl();
        var _version = "v9.1";
        var selectString = "?$select=" + attributes;
        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(envUrl+"/api/data/" + _version + "/" + entityName + "(" + id + ")" + selectString) , false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        var response = null;
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                req.onreadystatechange = null;
                if (req.status === 200)
                    response = JSON.parse(req.responseText);
                else
                    console.log(this);
            }
        };
        req.send();
        return response;
    } catch (e) {
        console.log(e.message);
    }
};
