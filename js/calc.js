//need to remove anything but numbers, minus signs, and periods
//add in $ and , for output
function calculate()
{	
	var total_balance = 0
	var total_payment = 0

	//$( '#total_balance' ).text('').empty()

	$( '.balance' ).each(
		function()
		{
			var val = $( this ).val() * 1
			if( ! isNaN( val ) )
				total_balance += val
		} // function
	) // each
	
	$( '.minimum_payment' ).each(
		function()
		{
			var val = $( this ).val() * 1
			if( ! isNaN( val ) )
				total_payment += val
		} // function
	) // each
	
	$( '.interest' ).each(
		function()
		{
			var val = $( this ).val() * 1
			if( ! isNaN( val ) )
				interest = val
		} // function
	) // each
	
	$( '#total_balance' ).text( money_format( total_balance ) )
	$( '#total_payment' ).text( money_format( total_payment ) )
	$( '#interest' ).text( interest )
} // calculate

function money_format( number )
{
	number = number.toFixed( 2 )

	number += ''
	parts = number.split( '.' )
	part1 = parts[0]
	part2 = parts.length > 1 ? '.' + parts[1] : ''
	
	var rgx = /(\d+)(\d{3})/
	
	while ( rgx.test( part1 ) ) 
		part1 = part1.replace( rgx, '$1' + ',' + '$2' )
		
	number = part1 + part2
	
	return number
} // money_format

function final_balance( amount_borrowed, amount_paid_per_payment, apr, years )
{
	//var balance, amount_borrowed, payments_per_year, amount_paid_per_payment, apr, years
	payments_per_year = 12
	
	part1 = amount_borrowed * ( Math.pow( ( 1 + apr / payments_per_year ), ( payments_per_year * years ) ) )
	part2 = amount_paid_per_payment
	part3 = Math.pow( ( 1 + apr / payments_per_year ), ( payments_per_year * years ) ) - 1 
	part4 = ( 1 + apr / payments_per_year ) - 1 
	
	balance = part1 - ( part2 * ( part3 / part4 ) )
	
	
	//balance = ( amount_borrowed * ( Math.pow( (1 + apr / payments_per_year ), (payments_per_year * years) ) ) ) - ( ( amount_borrowed * Math.pow( ( 1 + ( apr / payments_per_year ) ),  ( payments_per_year * years ) )- 1 ) / ( ( 1 + ( apr / payments_per_year ) ) - 1 ) )
	
	return balance
	
} // final_balance

/* 	Determines how long at a fixed (potentially changing) 
	payment per month it will take to reach $0.00. 
	Displays month by month payments. 
	
	This function works for one balance.
*/

function how_long_till_zero()
{

//	balance = balance * 1
//	payment = payment * 1
//	apr = apr * 1
	
	$( '.results' ).empty()

	var balance = $( '#total_balance' ).text()
	var payment = $( '#total_payment' ).text()
	var apr = $( '#interest' ).text() * 1

	balance = balance.replace(',','').replace('$','')
	payment = payment.replace(',','').replace('$','')

	balance = balance * 1
	payment = payment * 1
	
	if( payment <= 0 )
		die

	var total_charges
	var months = new Array()
	var c = 0
	var monthly_apr = apr/12
	
	var summary
	
	summary = "<table border=1>"
	summary += "<tr>"
		summary += "<th>Month</th>"
		summary += "<th>Payment</th>"
		summary += "<th>Finance Charge</th>"
		summary += "<th>Balance</th>"
	summary += "</tr>"
	
	summary += "<tr>"
		summary += "<td>0</td>"
		
		summary += "<td></td>"
		summary += "<td></td>"
		summary += "<td>" + money_format( balance ) + "</td>"
	summary += "</tr>"
	
	
	
	while( balance > 0 )
	{
		summary += "<tr>"
		
	
		if( balance < payment )
			payment = balance
			
		balance -= payment
		finance_charge = balance * monthly_apr
		total_charges += finance_charge
		balance += balance * monthly_apr
		
		summary += "<td>" + (c + 1 ) + "</td>"
		summary += "<td>" + money_format( payment ) + "</td>"
		summary += "<td>" + money_format( finance_charge ) + "</td>"
		summary += "<td>" + money_format( balance ) + "</td>"
		
		summary += "</tr>"
		
		
		
		//console.log( balance )
		
		c++

				
	} // while
	
	$( '<span>It will take ' + c + ' months to get out of debt.</span>' ).appendTo( $( '.results' ) )
	
	summary += "</table>"	

	
	$( '.results' ).append( summary )
	
} // how_long_till_zero

function pay_off_balances()
{
	var total_to_be_paid = $( '#fixed_monthly_payment' ).val()
	var total_minimum = $( '#total_payment' ).text() * 1
	
	
	if( total_to_be_paid < total_minimum )
		alert( 'Total to pay per month must be equal to or greater than the total minimum payments. ')
		
	else
	{
		var rows = new Array()
		var c = 0
		//get the data into an array
		$( '.row' ).each(
			function()
			{
				var array = new Array()
				array['balance'] = $( this ).find( '.balance' ).val()
				array['interest'] = $( this ).find( '.interest' ).val()
				array['min'] = $( this ).find( '.minimum_payment' ).val()
				array['name'] = $( this ).find( '.debt_name' ).val()
				rows[c] = array
				c++
	
			} // function
		) // each
		
		var ordered = new Array()
		
		c = 0
		
		while( c < rows.length )
		{
	
			var lowest_int = 1
			var lowest = 0
			
			for( i=0; i<rows.length; i++ )
			{
				
				if( rows[i]['interest'] < lowest_int )
				{
					lowest_int = rows[i]['interest']
					lowest = i
					
				} // if
				
			} // for
			var new_array = new Array()
			new_array['interest'] = rows[lowest]['interest']
			new_array['balance']  = rows[lowest]['balance']
			new_array['min'] = rows[lowest]['min']
			new_array['name'] = rows[lowest]['name']
			
			ordered[c] = new_array
			
			rows[lowest]['interest'] = 1.1
			
			
			c++
		} // while
		
		// at this point, the array 'ordered' is ordered from lowest interest rate to highest
		
		// pay off minimums on the rest, then the remainder on the selected balance
		
		var balance_remains = 0
		var months = 0
		var total_interest_paid = 0
		var biggest_interest_pointer = ordered.length - 1 
		var output = ''
		
		output += '<table>'
		
		output += '<tr>'
		output += '<th>month</th>'
		output += '<th>balance name</th>'
		output += '<th>starting balance</th>'
		output += '<th>interest</th>'
		output += '<th>payment</th>'
		output += '<th>new balance</th>'
		output += '</tr>'
		
		
		do
		{
			for( i = ( ordered.length - 1 ); i > -1; i-- )
			{
				var total_minimum = 0
				var the_balance = ordered[i]['balance']
				
				//get the total minimum payments, to subtract from total payments, to get total applied to biggest interest
				for( j=0; j < ordered.length; j++ )
				{
					if( ordered[j]['balance'] > 0 && i != j)
						total_minimum += ( ordered[j]['min'] * 1 )
	
				} // for
				
				
				//this balance + finance charge - payment
				//total_to_be_paid_this_month - payment
				
				//console.log( 'before changes: ' + ordered[i]['balance'] )
				
				if( ordered[i]['balance'] > 0 )
				{
					output += '<tr>'
					output += '<td>' + ( months + 1 ) + '</td>'
					output += '<td>' + ordered[i]['name'] + '</td>'
					output += '<td>' + ordered[i]['balance'] + '</td>'
										
					ordered[i]['balance'] = ordered[i]['balance'] * 1
					
					var this_interest = ( ordered[i]['balance'] * ( ordered[i]['interest']/12 ) )
					
					ordered[i]['balance'] += this_interest
					
					total_interest_paid += this_interest
					
					
					output += '<td>' + this_interest + '</td>'
					
					//console.log( 'after interest: ' + ordered[i]['balance'] )
					
					//if this is the first one, subtract what's left in the payment
					if( i >= biggest_interest_pointer )
					{
						
						console.log( 'if' )
						//payment = ( total_to_be_paid - total_minimum ) 
						//this payment is the total payment minus all minimum payments except for the minimum on the current payment
						if( ( total_to_be_paid - total_minimum ) > ordered[i]['balance'] )
						{
							payment = ordered[i]['balance']
							biggest_interest_pointer--
						} // if
						
						else
							payment = ( total_to_be_paid - total_minimum ) 
	
					} // if
					
					//otherwise subtract the min
					else
					{
						console.log( 'else' )
						
						if( ordered[i]['min'] > ordered[i]['balance'] )
							payment = ordered[i]['balance']
						
						else
							payment = ordered[i]['min']
							
					} // else
					
					ordered[i]['balance'] -= payment
					
					//console.log( 'payment = ' + payment )
					
					//console.log( 'after payment: ' + ordered[i]['balance'] )
					
					output += '<td>' + payment + '</td>'
					output += '<td>' + ordered[i]['balance'] + '</td>'
					
					output += '</tr>'
				} // if					
				
				console.log( ' ' )
			} // for
			
			
			//check for remaining balances
			balance_remains = 0
			
			for( k=0; k<ordered.length; k++ )
			{
				if( ordered[k]['balance'] > 0 )
					balance_remains ++
					
			} // for
			
			months ++
			
		} // do
		
		while( balance_remains > 0 )
		
		output += '</div>'
		$( '.results' ).empty().append( $( output ) )

		console.log( months + ' months' )
		console.log( total_interest_paid + ' total interest' )
	} // else	
	
	
} // pay_off_balances

function add_a_row()
{
	var num_rows = $( '#num_rows' ).val() * 1
	var last_row = '#row' + num_rows
	
	var empty_row
	empty_row += "\n<tr id='row" + (num_rows + 1) + "' class='row'>\n"
	empty_row += "\t<td>\n"
	empty_row += "\t\t<input type='text' class='debt_name' />\n"
	empty_row += "\t</td>\n\n"
	empty_row += "\t<td>\n"
	empty_row += "\t\t<input type='text' class='balance' />\n"
	empty_row += "\t</td>\n\n"
	empty_row += "\t<td>\n"
	empty_row += "\t\t<input type='text' class='interest' />\n"
	empty_row += "\t</td>\n\n"
	empty_row += "\t<td>\n"
	empty_row += "\t\t<input type='text' class='minimum_payment' />\n"
	empty_row += "\t</td>\n\n"

	$( empty_row ).insertAfter( $( '#row' + num_rows) )
	
	$( '.balance, .minimum_payment, .interest' ).blur( calculate )
		
	$( '#num_rows' ).val( num_rows + 1 )
	
} // add_a_row

// !ready
$( document ).ready(

	function()
	{
		$( '#calculate' ).click( calculate )
		
		$( '.balance, .minimum_payment, .interest' ).blur( calculate )
		
		$( '#balance' ).click(
			function()
			{
				/*
if( $( '#num_rows' ).val() == 1 )
					how_long_till_zero()
				
				else
*/
					pay_off_balances()
			} // function
		) // click
		
		$( '#pay_off_using_fixed' ).click( pay_off_balances )
		
		$( '#add_a_row' ).click( add_a_row )
			
	} // function
) // ready