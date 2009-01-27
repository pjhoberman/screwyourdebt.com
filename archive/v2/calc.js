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
				array['apr'] = $( this ).find( '.interest' ).val()
				array['min'] = $( this ).find( '.minimum_payment' ).val()
				rows[c] = array
				c++
	
			} // function
		) // each
		
		var ordered = new Array()
		
		c = 0
		
		while( c < rows.length )
		{
	
			var lowest_apr = 1
			var lowest = 0
			
			for( i=0; i<rows.length; i++ )
			{
				
				if( rows[i]['apr'] < lowest_apr )
				{
					lowest_apr = rows[i]['apr']
					lowest = i
					
				} // if
				
			} // for
			var new_array = new Array()
			new_array['apr'] = rows[lowest]['apr']
			new_array['balance']  = rows[lowest]['balance']
			new_array['min'] = rows[lowest]['min']
			
			//NOTE: check for same apr, order by balance, then by payment, then whatever
			ordered[c] = new_array
			
			rows[lowest]['apr'] = 1.1
			
			
			c++
		} // while
		
		// at this point, the array 'ordered' is ordered from lowest interest rate to highest
		
		// pay off minimums on the rest, then the remainder on the selected balance
		
		
		for( i=0; i<ordered.length; i++ )
		{
			var total_minimum = 0
			var the_balance = ordered[i]['balance']
			
			for( j=0; j<ordered.length - (i + 1); j++ )
			{
				if( ordered[j]['balance'] > 0 )
					total_minimum += ( ordered[j]['min'] * 1 )

			} // for
			
			while( the_balance > 0 )
			{
				var min = ordered[i]['min']
				//run if statement to take out more than min if it's the big card
				if( ordered[i]['min'] > the_balance )
					min = the_balance
					
				output = apply_payments_and_charges( the_balance, ordered[i]['apr'], min )	
				the_balance = output['balance']			
				console.log( the_balance )
			} // while
	
	/*
			//new function to subtract min payment and print results should go here
			if( i != ordered.length - 1 )
				total_payment -= ordered[i]['min']
			
			else
				console.log( total_payment )
	*/
		} // for
	} // else	
	
	
} // pay_off_balances

function apply_payments_and_charges( balance, apr, payment )
{
	var monthly_apr = apr/12
	var finance_charge
	var output = new Array()
	
	balance -= payment
	finance_charge = balance * monthly_apr
	balance += balance * monthly_apr
	
	output['finance_charge'] = finance_charge
	output['balance'] = balance
	
	return output
} // apply_payments_and_charges

function add_a_row()
{
	var num_rows = $( '#num_rows' ).val() * 1
	var last_row = '#row' + num_rows
	
	var empty_row
	empty_row += "\n<tr id='row" + (num_rows + 1) + "' class='row'>\n"
	empty_row += "\t<td>\n"
	empty_row += "\t\t<input type='text' />\n"
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
				if( $( '#num_rows' ).val() == 1 )
					how_long_till_zero()
				
				else
					pay_off_balances()
			} // function
		) // click
		
		$( '#pay_off_using_fixed' ).click( pay_off_balances )
		
		$( '#add_a_row' ).click( add_a_row )
			
	} // function
) // ready