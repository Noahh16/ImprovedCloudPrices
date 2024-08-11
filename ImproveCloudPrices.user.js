// ==UserScript==
// @name         ImproveCloudPrices
// @namespace    https://github.com/Noahh16/
// @version      1.0.0
// @description  A script that provides a one-click button to autmoatically delete all of your notifications in bulk
// @author       Noahh16
// @match        https://prices.osrs.cloud/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=osrs.cloud
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    var windowElement;
    // Function to check if the notification window is open
    function getNotificationWindowOpen() {
        const notificationWindow = $(".p-overlaypanel,p-component,p-ripple-disabled,p-overlaypanel-enter-done,p-overlaypanel-flipped");
        return notificationWindow;
    };

    // Function to expand the notification window
    function expandNotificationWindow() {
        $(".pi.pi-bell.p-overlay-badge").parentElement.click();
    }

    // Function to delete the first notification
    function deleteFirstNotification() {
        const deleteButton = document.querySelector('.p-button-text.p-button-danger.p-button-sm.p-1.priceNotificationModal_hidden-danger__pSUzN');
        if (deleteButton) {
            deleteButton.click();
            setTimeout(confirmDeletion, 500); // Adjust the delay as needed
        }
    };

    // Function to confirm deletion
    function confirmDeletion() {
        const confirmationBox = document.querySelector('.p-confirm-popup.p-component.p-ripple-disabled.p-connected-overlay-enter-done');
        const yesButton = confirmationBox.querySelector('.p-confirm-popup-accept.p-button-sm.p-button.p-component');
        if (confirmationBox && yesButton) {
            yesButton.click();
            setTimeout(reloadNotifications, 1000); // Adjust the delay as needed
        }
    }

    // Function to reload notifications after deletion
    function reloadNotifications() {
        // You can add your logic here to check if the notifications have reloaded
        console.log('Notifications reloaded after deletion');
    }

    var waitForSelector = function(selector, waitString, successString, callback) {
        if ($(selector) != null && $(selector).length > 0) {
            //setTimeout(function() {
                console.log(successString);
                callback();
            //}, 1000);
        } else {
            setTimeout(function() {
                console.log(waitString);
                waitForSelector(selector, waitString, successString, callback);
            }, 100);
        }
    }

    var waitForElementNotExist = function(element, waitString, successString, callback) {
        if (!document.body.contains(element)) {
            console.log(successString);
            callback();
        } else {
            setTimeout(function() {
                console.log(waitString);
                waitForElementNotExist(element, waitString, successString, callback);
            }, 100);
        }
    }

    function selectElement(selector) {
        return $(selector);
    }

    // Main function to perform the actions
    function automateNotifications(count) {
        let notificationWindow = ".p-overlaypanel,p-component,p-ripple-disabled,p-overlaypanel-enter-done,p-overlaypanel-flipped";
        let notificationButton = ".pi.pi-bell.p-overlay-badge";
        let deleteButton = '.p-button-text.p-button-danger.p-button-sm.p-1.priceNotificationModal_hidden-danger__pSUzN';
        let confirmDeleteButton = '.p-confirm-popup-accept.p-button-sm.p-button.p-component';

        // Click notification button
        if (selectElement(notificationWindow) == null || selectElement(notificationWindow).length == 0) {
            selectElement(notificationButton).click();
            console.log("Notification window not open, clicking button");
        } else {
            console.log("Notification window open, skipping click");
        }
        console.log("Notification button clicked");

        // Wait for notification window to open
        //var windowElement;
        waitForSelector(deleteButton, "Waiting for notification window to open...", "Notification window opened", function() {
            windowElement = selectElement(deleteButton);

            // Select first notification in list
            //selectElement(deleteButton)[0].click();
            if (windowElement[0] != null) {
                windowElement[0].click();
                console.log("Delete button clicked");

                // Wait for delete confirm window to open
                var confirmElement;
                waitForSelector(confirmDeleteButton, "Waiting for confirmation window to open...", "Confirmation window opened", function() {
                    confirmElement = selectElement(confirmDeleteButton);
                    let notification = windowElement[0];

                    // Click delete button
                    confirmElement[0].click();
                    console.log("Delete confirm button clicked");
                    count++;

                    waitForElementNotExist(notification, "Waiting for notification window to refresh...", "Notification window refreshed", function() {
                        console.log("Deleted " + count + " notifications");
                        automateNotifications(count);
                    });
                });
            } else {
                console.log("No more notifications left!");
            }
        });
    }

    function startDeleting(count) {
        setTimeout(function() {
            automateNotifications(count);
        }, 2000);
    }

    function addNotifEventListener() {
        let deleteButton = '.p-button-text.p-button-danger.p-button-sm.p-1.priceNotificationModal_hidden-danger__pSUzN';

        document.querySelector('.p-button-link.p-button-rounded.p-button.p-component>i').parentElement.addEventListener('click', function() {
            waitForSelector(deleteButton, "Waiting for notification window to open...", "Notification window opened", function() {
                createDeleteElement(document.querySelector('.text-2xl.mb-2'));
            });
        });
    }

    function createDeleteElement(parentElement) {
        parentElement.insertAdjacentHTML('beforeend', `<button data-pc-name="button" data-pc-section="root" class="p-button-danger p-button-text p-button p-component p-button-icon-only">
                                 <span class="p-button-icon p-c pi pi-times" data-pc-section="icon"></span>
                                 <span class="p-button-label p-c" data-pc-section="label"></span>
                             </button>`);
        parentElement.lastChild.addEventListener('click', function() {
            startDeleting(0);
        });
    }

    addNotifEventListener();
})();
