const marksColor = {
    '12': '#35DD64',
    '11': '#35DD64',
    '10': '#35DD64',

    '9': '#BEE550',
    '8': '#BEE550',
    '7': '#BEE550',

    '6': '#F1CF55',
    '5': '#F1CF55',
    '4': '#F1CF55',

    '3': '#E46464',
    '2': '#E46464',
    '1': '#E46464',

    'Н': '#5AADDD',
};



function showComment(element) {
    let comment = element.nextElementSibling;
    comment.classList.contains('show') ? comment.classList.remove('show')
    : comment.classList.add('show');
}