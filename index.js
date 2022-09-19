row = 5
col = 5

//append input tablet
function constructTablet(){
    let html = "";
    for(let i = 0; i < row; i++){
        html += '<div class="row">';
        for(let j = 0; j < col; j++){
            html += '<div class="cell" id="' + (i * col + j) + '"></div>';
        }
        html += '</div>';
    }
    $("#input_container").append($(html));
}

//number of ones in number(binary)
function bitNumber(number) {
    let res = 0;
    for(let i = 0; i < row*col; i++){
        if(number & 1){
            res++;
        }
        number = number >>> 1;
    }
    return res;
}

//get differences between two table configurations
function tabletDifference(configuration, pattern) {
    let common = 0;
    let add = 0;
    let move = 0;

    for(let i = 0; i < row*col; i++){
        if(configuration & pattern & 1){
            common++;
        }
        else if((pattern & 1) && !(configuration & 1)){
            add++;
        }
        else if( (configuration & 1) && !(pattern & 1)){
            move++;
        }
        configuration = configuration >>> 1;
        pattern = pattern >>> 1;
    }
    add = add - move;

    return [common, add, move];
}

//comparation of results for sorting
function compareFn(a, b) {
    //common tiles
    if (a[1] > b[1]) {
        return -1;
    }
    if (a[1] < b[1]) {
        return 1;
    }
    //tiles to add
    if (a[2] > b[2]) {
        return -1;
    }
    if (a[2] < b[2]) {
        return 1;
    }
    //tiles to move
    if (a[3] > b[3]) {
        return -1;
    }
    if (a[3] < b[3]) {
        return 1;
    }
    return 0;
}

//construct Result & Preview Tablet
function constructResult(configuration, input_tablet){
    let html = '<div class="result">';
    let _html = '<div class="result">';
    html += '<div style="text-align:center;"><font size="4"><span><b> 你的桌台 </b></span></font></div>';
    html += '<div class="result_table">';
    _html += '<div style="text-align:center;"><font size="4"><span><b> 最佳路径 </b></span></font></div>';
    _html += '<div class="result_table">';
    for(let i = 0; i < row; i++){
        html += '<div class="row">';
        _html += '<div class="row">';
        for(let j = 0; j < col; j++){
            html += '<div class="cell';
            _html += '<div class="cell';
            if(configuration[0] & 1){
                html += ' active';
                _html += ' active';
            }
            if(configuration[0] & input_tablet & 1){
                html += ' green';
                _html += ' active';
            }
            else if((configuration[0] & 1) && !(input_tablet & 1)){
                html += ' yellow';
                _html += ' active';
            }
            else if( (input_tablet & 1) && !(configuration[0] & 1)){
                html += ' red';
                _html += '';
            }
            html += '" id="' + (i * col + j) + '"></div>';
            _html += '" id="' + (i * col + j) + '"></div>';
            configuration[0] = configuration[0] >>> 1;
            input_tablet = input_tablet >>> 1;
        }
        html += '</div>';
        _html += '</div>';
    }
    html += '</div>';
    html += '<div class="result_text">';
    html += '<div><span>保持不动: </span><span class="green">' + configuration[1] + '</span></div>';
    html += '<div><span>需要新增: </span><span class="yellow">' + configuration[2] + '</span></div>';
    html += '<div><span>需要移动: </span><span class="red">' + configuration[3] + '</span></div>';
    html += '</div></div>';

    _html += '</div>';
    _html += '<div class="result_text">';
    _html += '<div><span>保持不动: </span><span class="green">' + configuration[1] + '</span></div>';
    _html += '<div><span>需要新增: </span><span class="yellow">' + configuration[2] + '</span></div>';
    _html += '<div><span>需要移动: </span><span class="red">' + configuration[3] + '</span></div>';
    _html += '</div></div>';
    $("#output_container").append($(html));
    $("#output_container").append($(_html));
}

$(document).ready(function () {
    //init input table
    constructTablet();
    let table_configuration;
    //precomputed patterns
    let top_configurations_4x5 = [487095, 987063, 775806, 517821, 1032957, 1003197, 1033917, 1003191, 775869, 972591, 974367, 487101, 776046, 783486, 972351, 775983, 1017783, 516861, 783423, 974607, 972414, 1033911, 517815, 775743, 972654, 972471]
    let top_configurations_5x4 = [1019679, 510879, 933279, 1023325, 764831, 965919, 1022863, 510935, 875935, 764887, 1023263, 1022919, 965981, 1023294, 1022891, 514987, 990654, 515015, 875966, 990623, 1018783, 991119, 965950, 514959, 933310, 1018839]
    let top_configurations_5x5 = [32570911, 16571935, 33087007, 31120927, 16572175, 33087247, 31121167, 33087127, 16572055, 33090907, 31179517, 16539325, 33054397, 32109757, 32102077, 15587005, 33092797, 33085117, 16570045, 24827581, 33061951, 32109631, 33092671, 24835135, 32109694, 33092734, 24835198, 25069495, 31585975, 32569015, 16570039, 15586999, 33085111, 32102071, 31119031, 16539199, 33054271, 16539439, 33054511, 31585855, 32568895, 31585918, 32568958, 24827518, 24827758, 24827455, 24827695, 31119151, 31119214, 31118911, 31118974, 24796735, 24796975, 28667455, 30602878, 30602815];
    let result_array = [];

    //tile selection
    $(document).on('click', '#input_container .row .cell', function () {
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }
        else{
            $(this).addClass('active');
        }
    });

    //button 4x5
    $('#button_4x5').on('click', function () {
        row = 4;
        col = 5;
        $("#input_container").empty();
        constructTablet();
    });

    //button 5x4
    $('#button_5x4').on('click', function () {
        row = 5;
        col = 4;
        $("#input_container").empty();
        constructTablet();
    });

    //button 5x5
    $('#button_5x5').on('click', function () {
        row = 5;
        col = 5;
        $("#input_container").empty();
        constructTablet();
    });

    //button click
    $('#button').on('click', function () {
        result_array = []
        //empty previous results
        $("#output_container").empty();
        //get current table configuration
        table_configuration = 0;
        $('#input_container .active').each(function () {
            table_configuration += Math.pow(2, $(this).attr('id'));
            console.log(table_configuration);
        });
        let top_configurations;
        if (bitNumber(table_configuration) > 17) {
            //to many tiles
            let html = '<div class="result_error">Too many tiles selected. No possible result.</div>';
            $("#output_container").append($(html));
        } else {
            //add description
            //let html = '<div class="result_description"><span class="green">Green</span> tiles are in the right place.<br><span class="yellow">Yellow</span> tiles are missing and need to be filled by changing water tile to empty tile or by moving <span class="red">red</span> tile to it\'s place.<br><span class="red">Red</span> tiles are in wrong place and need to be moved to a <span class="yellow">yellow</span> tile</div>';
            //$("#output_container").append($(html));
            //calculate, sort and print results
            if (row == 4 && col == 5)
                top_configurations = top_configurations_4x5
            else if (row == 5 && col == 4)
                top_configurations = top_configurations_5x4
            else
                top_configurations = top_configurations_5x5

            top_configurations.forEach(function myFunction(configuration) {
                let differences = tabletDifference(table_configuration, configuration);
                let output = [configuration, differences[0], differences[1], differences[2]];
                result_array.push(output);

            });
            //sort results
            result_array.sort(compareFn);
            //print results
            constructResult(result_array[0], table_configuration);
            // result_array.forEach(function myFunction(configuration) {
            //     constructResult(configuration, table_configuration);
            // });
        }
    });
});
