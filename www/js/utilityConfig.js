
// TODO: use require js
// Requires:
// - jquery-ui
// - jquery.scrollto

var SCROLL_SPEED = 200;
var SCROLL_OPTIONS = {offset: -100}

var utilityEditorID = "#utility-editor";

var utilityEditor;

$(function() {
    var dateInputs = $("[name=startdate], [name=enddate]");

    utilityEditor = $(utilityEditorID)[0];
    utilityEditor.reset();

    // Make jdPicker give us controls that always show.
    dateInputs.attr('type', 'hidden');
    dateInputs.jdPicker({
        date_format: 'YYYY-mm-dd',
        start_of_week: 0
    });

}); // window load

// =================================================================================================
// UTILITY CONFIG
// =================================================================================================
function editUtility(editButton) {
    var utilityData = getRowData(editButton);
    setUtilityEditorData(utilityData);
    editConfig(utilityEditor, utilityData);
}

function submitUtility() {
    $.post('/manager/submit-utility.php', getUtilityEditorData())
    .done(function(data) {
        utilityEditor.reset();
        location.reload();
    })
    .fail(function(data) {
        alert("Error Submitting Utility Costs: " + data.statusText);
    });

    return false;
}

function deleteUtility(deleteButton) {
    var utilityID = getRowData(deleteButton).id;

    $.post('/manager/delete-utility.php', {id: utilityID})
    .done(function(data) { window.location.reload(); })
    .fail(function(data) { alert("Error deleting utility cost configuration: " + data.statusText); });
}

function getUtilityEditorData() {
    var utilityEditorContents = $(utilityEditor).contents();

    return {
        id: utilityEditorContents.find('input[name=id]').val(),
        type: utilityEditorContents.find('input[name=type]').val(),
        price: utilityEditorContents.find('input[name=price]').val(),
        startdate: utilityEditorContents.find('input[name=startdate]').val(),
        enddate: utilityEditorContents.find('input[name=enddate]').val()
    };
}

function setUtilityEditorData(utility) {
    var utilityEditorContents = $(utilityEditor).contents();
    utilityEditorContents.find('input[name=type]').val(utility.type);
    utilityEditorContents.find('input[name=price]').val(utility.price);
    utilityEditorContents.find('input[name=startdate]').val(utility.startdate);
    utilityEditorContents.find('input[name=enddate]').val(utility.enddate);
    utilityEditorContents.find('input[name=id]').val(utility.id);
}

// =================================================================================================
// GENERAL CONFIG
// =================================================================================================
function getRowData(rowButton) {
    var row = $(rowButton).closest("tr");

    return {
        id: row.attr('id').match(/\d+/)[0],
        type: $(row.children(".type")).text(),
        price: $(row.children(".price")).text(),
        startdate: $(row.children(".startdate")).text(),
        enddate: $(row.children(".enddate")).text()
    };
}

function editConfig(editor, data) {
    $.scrollTo(editor, SCROLL_SPEED, SCROLL_OPTIONS);

    // Make the legend red and add (EDITING "NAME") to text
    var legend = $(editor).find("legend")[0];
    legend.style.color = 'red';
    legend.innerHTML = legend.innerHTML.replace(/\(.*$/, ""); // Remove any existing (EDITING "NAME") text
    legend.innerHTML += " (EDITING \"" + data.startdate + " to " + data.enddate + "\")";
}

function resetEditor(clearButton) {
    var form = $(clearButton).closest("form")[0];
    form.reset();

    var legend = $(form).find("legend")[0];
    legend.style.color = 'black';

    legend.innerHTML = legend.innerHTML.replace(/\(.*$/, "");
}

