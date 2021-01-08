$(document).ready(function() {
    $.get("/admin/api/users/pending", function(data, status){
        console.log("Data: ", data);
        var list = data.data

        var finalHTML = "";
        list.forEach((item) => {
            finalHTML += `<div class="col-lg-6 col-md-6 py-3" id="user-item-${item.id}">
            <div class="card">
              <div class="w-100 justify-content-center">
                <img src="${item.profile_image_url}" class="user-image" width="136" height="136" alt="">
                <h5 class="user-name">${item.first_name} ${item.last_name}</h5>
                <h6 style="margin-top: 8px; margin-bottom: 24px;">${item.email}</h6>
                <h6 style="margin-top: 8px; margin-bottom: 24px; display: none;">Date of Birth: 2002/02/21</h6>
                <h6 class="user-name-exists-text" style="display: none;">Note: A User with this Name has already been Approved</h6>
                <button class="btn my-2 mx-1 logout-button grow w-100 id-button" onclick="openIDModal('${item.id_image_url}')">View ID</button>
                <button class="btn my-2 mx-1 logout-button grow w-100 approve-button" onclick="approveUser('${item.id}')">Approve</button>
                <button class="btn my-2 mx-1 logout-button grow w-100 deny-button" onclick="denyUser('${item.id}')">Deny</button>
              </div>
            </div>
          </div>`
        });

        $(".pendingUsersList").html(finalHTML);
    });
});

function approveUser(id){
    $(`#user-item-${id}`).remove()
    $.post("/admin/api/user/approve", {user_id: id}, function(data, status){
        console.log("Data: ", data);
    });
}

function denyUser(id){
    $(`#user-item-${id}`).remove()
    $.post("/admin/api/user/deny", {user_id: id}, function(data, status){
        console.log("Data: ", data);
    });
}

function openIDModal(image_link){
    $('#id-image').attr('src', image_link);
    $('#id-modal').modal('show');
}