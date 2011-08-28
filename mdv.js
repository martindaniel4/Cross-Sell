
		
	var cat_selection = "Jeux_Video";
		
	var data_nest = d3.nest().key(function(d) {return d.category;}).map(data_total.sort(function(a,b) {return a.revenue1 - b.revenue1;})),
		data_total_sort = data_total.sort(function(a, b) {return a.category > b.category;}),
		data_nest_category = d3.nest().key(function(d) {return d.name;}).map(data_category.sort(function(a,b) {return b.name > a.name;})),
		data = data_nest[cat_selection],
		data1 = data_nest_category[cat_selection][0].link.sort(function(a, b) {return b.value - a.value;});
	 
	 
    var w0 = document.body.clientWidth/2,
        h0 = document.body.clientHeight*0.98,
		wb = 500,
		hb = wb/2,
		wa = w0*0.9,
		ha = h0/3,
		wi = w0*0.7,
		hi = h0/2,
		offset_i = w0/7.7,
		translate_i = offset_i*1.7,
		translate_a = translate_i*0,
		translate_barres = translate_i,
		max_lettres = w0 / 18,
	    w = w0*0.65,
        h = h0*0.55,
		r0 = h * .45,
		r1 = r0 * 1.2,
		num_produits = data.length;
	
		var minV = d3.min(data_total, function(d) {return d.revenue1;}),
		maxV = d3.max(data_total, function(d) {return d.revenue1;});
		
		var max_cat = [];
		
		data_category.forEach(function(p) {
			
			max_cat.push({
			
			max: d3.max(p.link, function(d) {return d.value;}),
			min: d3.min(p.link, function(d) {return d.value;})
			
			})
						})
		
		
		var minV1 = d3.min(max_cat, function(d) {return d.min;}),
		maxV1 = d3.max(max_cat, function(d) {return d.max;});
		
		var echelles = [],
			top_correlation = [],
			arbre = {};
		
		data_total.forEach(function(p) {
			
			echelles.push({
			
			max_indice: d3.max(p.connections, function(d) {return d.indice;}),
			min_indice: d3.min(p.connections, function(d) {return d.indice;}),
			
			max_revenue: d3.max(p.connections, function(d) {return d.revenue;}),
			min_revenue: d3.min(p.connections, function(d) {return d.revenue;}),
			
			max_quantity: d3.max(p.connections, function(d) {return d.quantity;}),
			min_quantity: d3.min(p.connections, function(d) {return d.quantity;})
			
			})

						})
						
 var max_indice = d3.max(echelles, function(d) {return d.max_indice;}),
	 min_indice = d3.min(echelles, function(d) {return d.min_indice;}),
	 max_revenue = d3.max(echelles, function(d) {return d.max_revenue;}),
	 min_revenue = d3.min(echelles, function(d) {return d.min_revenue;}),
	 max_quantity = d3.max(echelles, function(d) {return d.max_quantity;}),
	 min_quantity = d3.min(echelles, function(d) {return d.min_quantity;});

		
		var height = d3.scale.linear().domain([minV, maxV]).range([0, 100]),
		height1 = d3.scale.linear().domain([minV1, maxV1]).range([0, 100]),
		
		offset = d3.scale.linear().domain([minV, maxV]).range([-1.2, -1.2]),
		offset1 = d3.scale.linear().domain([minV1, maxV1]).range([1.10, 1.10]),
		
		angle1 = d3.scale.ordinal().domain(d3.range(0, data1.length)).rangeBands([0.02*Math.PI, 0.98* Math.PI]),
		
		max_bars = d3.max(bars, function(d) {return d.value;}),
        min_bars = d3.min(bars, function(d) {return d.value;}),
		
		width_bars = d3.scale.linear().domain([min_bars, max_bars]).range([20, 200]),
		
		color_line = d3.scale.linear()
    .domain([min_indice, max_indice])
    .range(["lightgrey", "grey"]),
	
	color_indice = d3.scale.linear()
    .domain([min_indice, max_indice])
    .range(["lightgrey", "grey"]),
	
	color_revenue = d3.scale.linear()
    .domain([min_revenue, max_revenue])
    .range(["lightgrey", "grey"]),
	
	color_quantity = d3.scale.linear()
    .domain([min_quantity, max_quantity])
    .range(["#60b59e", "#086340"]),
	
	color_category = d3.scale.category20(),
	
	darker_indice = d3.scale.linear()
	.domain([min_indice, max_indice])
    .range([0.5, 1]),
	
	size = d3.scale.linear()
    .domain([min_indice, max_indice])
    .range([1.5, 4]),
	
	width_indice = d3.scale.linear()
    .domain([min_indice, max_indice])
    .range([20, w0/18]),
	
	width_revenue = d3.scale.linear()
    .domain([min_revenue, max_revenue])
    .range([20, w0/18]),
	
	width_quantity = d3.scale.linear()
    .domain([min_quantity, max_quantity])
    .range([20, w0/18]);

  var cluster = d3.layout.cluster()
      .size([h0/3, 50]);
	  
  var cluster_top = d3.layout.cluster()
      .size([h0*0.8, 200]);
  
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
	  
  var diagonal_top = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x + 13]; });
	
	line = d3.svg.chord()
        .startAngle(function(d) { return (d.startAngle + d.endAngle) / 2; })
        .endAngle(function(d) { return (d.startAngle + d.endAngle) / 2; })
        .radius(h / 2 - 15),
		
        angles = {},
		data_length = [],
        connections = [],
		data_bars = []
		
		function fangle(a) {
		return d3.scale.ordinal().domain(d3.range(0, a)).rangeBands([1.02*Math.PI , 1.98 * Math.PI]);
		}
		
		function couper(a, b) {
		return a.slice(0,b);
		}
		
		var format = d3.format("1f"),
			mille = d3.format(",");
		
		data_category.forEach(function(p) {
		
		l = data_nest[p.name].length
		
        data_nest[p.name].forEach(function(d, i) {
		  
		  var a = fangle(l)(i)
		  
          angles[d.name] = { 
            startAngle: a, 
            endAngle: a + fangle(l).rangeBand() / 2
			
          }
		
		})
		  
		data_length.push({
		
			name: p.name,
			longueur: l
		}
		)
		  
        })
		
		data_length.sort(function(a,b) {return b.name > a.name;}).forEach(function(p) {
		
		if (p.longueur > 10) 
		
				{return data_bars.push({
						name: p.name,
						value: d3.nest().key(function(d) {return d.name;}).map(bars)[p.name][0].value
										})
				;}
		
		})
		
		data1.forEach(function(d, i) {
          var a = angle1(i)
          angles[d.name] = { 
            startAngle: a, 
            endAngle: a + angle1.rangeBand() / 2 
          }
        })
		
    data_category.forEach(function(p) {
	
	data_nest[p.name].forEach(function(d) {
          d.connections.forEach(function(c) {
            connections.push({
              source: angles[d.name],
              target: angles[c.category],
			  indice: c.indice,
			  index: d.name,
			  category: d.category,
			  category_target: c.category,
			  revenue: c.revenue,
			  revenue_cross: c.revenue_cross,
			  name_target: c.name
            })
          })
        })
		})
	
	 var top50 = connections.sort(function(a, b) {return b.indice - a.indice;}).slice(0,25);
       
		 data_total.forEach(function(d) {

            arbre[d.name] = {
              name: d.name,
			  children: d.connections
            }

        })
		
	top50.forEach(function(d) {

            top_correlation.push({
			
              name: d.index,
			  level: "b",
			  children: [{name: d.name_target, category: d.category_target, indice: d.indice, revenue: d.revenue_cross, quantity: d.quantity}]
            })

        })
 
 var data_top_correlation = [{"name": "", "level":"a", "children": top_correlation}]
		
		
var start_date = couper(data_date[0].dateStart, 10),
	end_date = couper(data_date[1].dateEnd, 10);

d3.select("#sous_titre").append("text")
	.text("From"+" "+start_date+" "+"to"+" "+end_date);
    
    var vis = d3.select("#chord").append("svg:svg")
        .attr("width", w0)
        .attr("height", h0*0.9)
		.attr("id", "container")
      .append("svg:g")
        .attr("transform", "translate(" + w0 / 2 + "," + h0 / 2.3 + ")");
		
	vis.append("svg:text")
		.attr("class", "text") 
		.attr("id", "text_intro")
		.attr("dx", -w0/6)
		.attr("dy", -h0/6)
		.text("Choose a category to start.");
	 
	var produits = d3.select("#container").append("svg:svg")
		.attr("width", w0)
        .attr("height", h0)
	.append("svg:g")
        .attr("transform", "translate(" + w0 / 2 + "," + h0 / 2.3 + ")");
	
	var cat = d3.select("#container").append("svg:svg")
	.attr("width", w0)
    .attr("height", h0)
	.append("svg:g")
    .attr("transform", "translate(" + w0 / 2 + "," + h0 / 2.3 + ")");
		
	var base_arbre = d3.select("#arbre").append("svg:svg")
	.attr("width", wa)
	.attr("height", ha)
	.attr("z-index", 1)
	.attr("id", "base_arbre");
		
	var connections_nest = d3.nest().key(function(d) {return d.category;}).map(connections);
	 
function groupTicks(d) {

  return d3.range(1).map(function() {
	
	return {
	
      angle: 190*angles[d.name].startAngle,
      label: d.name,
	  value: d.revenue1
    };
  });
}

function groupTicks1(d) {

  return d3.range(1).map(function() {
	
	return {
	
      angle: 190*angles[d.name].startAngle,
      label: d.name,
	  value: d.value
    };
  });
}

	 function fade(select, name) {
	 
   d3.selectAll("path.chord")
	 .filter(function(d){
	 return d.index != name;}
	 )
      .transition()
        .attr("visibility", function () {if (select==0) {return "hidden";}
										 if (select==1) {return "visible";}
										 });
	function remove_arbre() {
	
	d3.select("#vis_tree").remove();
	d3.select("#titre_arbre").selectAll("text").remove();
	d3.select("#sous_titre_arbre").selectAll("text").remove();
	
	}
	

	if (select==0) {return render_arbre(name);}
	if (select==1) {return remove_arbre();}
		
  };
  
  function fade_cat(select, name) {
	 
   d3.selectAll("path.chord")
	 .filter(function(d){
	 return d.index != name;}
	 )
      .transition()
        .attr("visibility", function () {if (select==0) {return "hidden";}
										 if (select==1) {return "visible";}
										 });
		
  };
 
  
  function render_chord(a) {
		
	var i = data_nest[a],
		j = connections_nest[a],
		b = d3.nest().key(function(d) {return d.name;}).map(data_length)[a][0].longueur,
		k = data_nest_category[a][0].link;
	
	titre_wheel()
	
	function titre_wheel() {
	
	d3.select("#titre2").selectAll("text").remove()
	d3.select("#sous_titre2").selectAll("text").remove()
	
	d3.select("#titre2").append("text")
		.text(a+" "+"|"+" "+"Correlation of top"+" "+b+" "+"products")
	
	d3.select("#sous_titre2").append("text")
		.text("Mouse over on products to get full correlation details");
	
	}
	
	produits.selectAll("path")
        .data(i)
	.enter().append("svg:path")
        .attr("d", d3.svg.arc()
		.innerRadius(h / 2 - 15)       
	    .outerRadius(function(d){return h / 2 - 10 + height(d.revenue1);})
        .startAngle(function(d, i) { return angles[d.name].startAngle })
        .endAngle((function(d, i) { return angles[d.name].endAngle; } )))
		.attr("a", function(d) {return d.name;})
		.attr("fill", function(d) {return color_category(d.category);})
		.attr("opacity", 0.7)
		.on("mouseover", function(d){return fade(0, d.name);})
		.on("mouseout", function(d){return fade(1, d.name);} );
	
	var basep = produits.append("svg:g")
				.selectAll("g")
					.data(i)
				.enter().append("svg:g")
	
		var ticksp = basep.selectAll("g")
			.data(groupTicks)
		.enter().append("svg:g")
			.attr("transform", function(d) {
      return "rotate(" + (d.angle / Math.PI*0.95 + 91) + ")"
          + "translate(" + (r0*offset(d.value)) + ",0)";
    });
	
	ticksp.append("svg:text")
		.attr("x", 8)
		.attr("dy", ".35em")
		.attr("class", "tticks")
		.attr("opacity", 1)
		.attr("text-anchor", "end")
		.text(function(d) { return couper(d.label, 25); })
		.on("mouseover", function(d){return fade(0, d.label);})
		.on("mouseout", function(d){return fade(1, d.label);});
	
	vis.selectAll('path.c')
      .data(j)
    .enter().append('svg:path')
      .attr('d', line)
	  .attr("class", "chord")
	  .attr('stroke', function(d) {return color_category(d.category_target);})
	  .attr("opacity", function(d) {return darker_indice(d.indice);})
	  .attr("stroke-width", function(d) {return size(d.indice);})
	
	cat.selectAll("path")
        .data(k)
      .enter().append("svg:path")
        .attr("d", d3.svg.arc()
        .innerRadius(h / 2 - 15)
        .outerRadius(function(d) {return h / 2 - 10 + height1(d.value);})
        .startAngle(function(d, i) { return angles[d.name].startAngle })
        .endAngle(function(d, i) { return angles[d.name].endAngle; }))
		.attr("opacity", 0.7)
		.attr("fill", function(d) {return color_category(d.name);});
	
	var ticksc = cat.append("svg:g")
		.selectAll("g")
		
			.data(k)
		.enter().append("svg:g")
		.selectAll("g")
			.data(groupTicks1)
		.enter().append("svg:g")
			.attr("transform", function(d) {
      return "rotate(" + (d.angle / Math.PI*0.95 - 88) + ")"
          + "translate(" + (r0*offset1(d.value)) + ",0)";
    });
	
	ticksc.append("svg:text")
    .attr("x", 8)
    .attr("dy", ".35em")
	.attr("class", "tticks")
    .text(function(d) { return d.label; });
	
		}

 function render_arbre(p) {

	titre_arbre()
	
	function titre_arbre() {
	
	d3.select("#titre_arbre").selectAll("text").remove()
	d3.select("#sous_titre_arbre").selectAll("text").remove()
	
	d3.select("#titre_arbre").append("text")
		.text("Product correlation details")
	
	d3.select("#sous_titre_arbre").append("text")
		.text(p);
	
	}
	
	
	var vis_tree = d3.select("#base_arbre").append("svg:svg")
	.attr("width", wa)
	.attr("height", ha)
	.attr("id", "vis_tree");
	
	var arbre_vis = vis_tree.append("svg:svg")
	.attr("width", wa)
	.attr("id", "arbre_vis")
	.append("svg:g")
     .attr("transform", "translate(" + translate_i*1.3 + ", 10)");
  
  
	var nodes = cluster.nodes(arbre[p]);
  
     var link = arbre_vis.selectAll("path.link")
       .data(cluster.links(nodes))
     .enter().append("svg:path")
       .attr("class", "link")
       .attr("d", diagonal)
	   .attr("stroke", function(d) {return color_category(d.target.category);})
	   .attr("stroke-width", function(d) {return size(d.target.indice);})
	   .attr("opacity", function(d) {return darker_indice(d.target.indice);})
 
   var node = arbre_vis.selectAll("g.node")
       .data(nodes)
     .enter().append("svg:g")
       .attr("class", "node")
       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
 
	node.append("svg:text")
       .attr("dx", function(d) { return d.children ? -translate_i*1.3 : 10; })
       .attr("dy", 3)
       .text(function(d) { return couper(d.name, max_lettres); });

	var indice = vis_tree.append("svg:svg")
		.attr("id", "indice")
	.append("svg:g")
		.attr("transform", "translate(" + translate_a +", 10)");;
	
	indice.selectAll("rect")
		.data(nodes)
	.enter().append("svg:rect")
       .attr("width", function(d) {return width_indice(d.indice);})
	   .attr("x", wi)
	   .attr("height", 5) 
	   .attr("y", function(d) {return d.x - 5;})
	   .attr("fill", function(d) {return color_indice(d.indice);});
	
	indice.selectAll("text")
		.data(nodes)
	.enter().append("svg:text")
		.attr("x", function(d) {return width_indice(d.indice);})
		.attr("dx", wi + 5)
		.attr("dy", function(d) {return d.x+1.5;})
		.attr("class", "node")
		.text(function(d) { 
				
				if ( format(d.indice) == "NaN") {return "";}
					else
						{return mille(format(d.indice));}
						 });
		
	indice.append("svg:text")
		.attr("y", 0)
		.attr("class", "node_titre")
		.attr("dx", wi)
		.text("Cross Index");
						 
						 }
  
  window.addEventListener("keypress", render_top_correlation, false); 

  
  function render_top_correlation() {
  
  remove_chord() 
 
  function remove_chord() {
  
  d3.select("#text_intro").remove();

	 
	produits.selectAll("path").remove()
	 
  
	 
	 produits.selectAll("g").remove()
	 
  
	 
	 vis.selectAll("path").remove()
	 

	 
	 cat.selectAll("path").remove()
	 
	 
	 cat.selectAll("g").remove()
	
	 
	 d3.select("#top_correlation_container").remove()
	 d3.select("#titre2").selectAll("text").remove()
	 d3.select("#sous_titre2").selectAll("text").remove()
  
  }
  
  titre_top_correlation()
  
  function titre_top_correlation() {
	
	d3.select("#titre2").selectAll("text").remove()
	d3.select("#sous_titre2").selectAll("text").remove()
	
	d3.select("#titre2").append("text")
		.text("All Categories | Top correlated products")
	
	d3.select("#sous_titre2").append("text")
		.text("Display top 25 correlated products over the period");
	
	}
  
  var base_top_correlation = d3.select("#container")
  .append("svg:g")
	.attr("id", "top_correlation_container")
	.attr("transform", "translate(" + w0/6.3 + ", 10)" );

  var nodes_top = cluster_top.nodes(data_top_correlation[0]);

  var link = base_top_correlation.selectAll("path.link")
      .data(cluster_top.links(nodes_top))
    .enter().append("svg:path")
      .attr("class", "link")
	  .attr("level", function(d) {return d.source.level;})
	  .attr("stroke", function(d) {return color_category(d.target.category);})
	  .attr("stroke-width", function(d) {return size(d.target.indice);})
      .attr("d", diagonal_top);
	  
  var node = base_top_correlation.selectAll("g.node")
      .data(nodes_top)
    .enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("svg:text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 16)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return couper(d.name, w0/18); });
	
  d3.selectAll("[level=a]").remove();
  
 
	var indice = base_top_correlation.append("svg:svg")
		.attr("id", "indice_top")
	.append("svg:g")
		.attr("transform", "translate(0, 0)");;
	
	indice.selectAll("rect")
		.data(nodes_top)
	.enter().append("svg:rect")
       .attr("width", function(d) {return width_indice(d.indice);})
	   .attr("x", w0/1.5)
	   .attr("height", 5) 
	   .attr("y", function(d) {return d.x + 10;})
	   .attr("opacity", 0.8)
	   .attr("fill", function(d) {return color_indice(d.indice);});
	
	indice.selectAll("text")
		.data(nodes_top)
	.enter().append("svg:text")
		.attr("x", function(d) {return width_indice(d.indice);})
		.attr("dx", w0/1.5 + 5)
		.attr("y", function(d) {return d.x + 16;})
		.attr("class", "node")
		.text(function(d) { 
				
				if ( format(d.indice) == "NaN") {return "";}
					else
						{return format(d.indice);}
						 });
		
		indice.append("svg:text")
		.attr("y", 10)
		.attr("class", "node_titre")
		.attr("dx", w0/1.5)
		.text("Cross Index");

  }
  


    function fade_barre(opacity, name) {
	 
   barres.select("#"+name)
	 .attr("opacity", opacity);
		
  };
  
  
	var barres = d3.select("#barres").append("svg:svg")
		.attr("width", wb)
        .attr("height", hb);
		
	barres.selectAll("rect")
		.data(data_bars.sort(function(a,b) {return b.value - a.value;}))
	.enter().append("svg:rect")
		.attr("y", function(d, i) {return 10 + i*21;}) // ajouter un offset générique pour la distance top début des barres
		.attr("x", translate_barres)
		.attr("width", function(d) {return width_bars(d.value);})
		.attr("height", 19)
		.attr("cursor", "pointer")
		.attr("id", function(d) {return d.name;})
		.attr("opacity", 0.6)
		.on("mouseover", function(d){return fade_barre(1, d.name);})
		.on("mouseout", function(d){return fade_barre(0.6, d.name);})
		.attr("name", function(d) {return d.name;})
		.attr("fill", function(d) {return color_category(d.name);})
		.on("click", function transition() {
	
	d3.select("#text_intro").remove();
	
	var a = d3.select(this).attr("name");
	
	next()
	
	function next() {
	
	transition_out()
	
	function transition_out() {
	  
	  remove()
	  
	 function remove() {
	 
	 produits.selectAll("path").remove()

	 
	 produits.selectAll("g").remove()

	 
	 vis.selectAll("path").remove()
	 
	 cat.selectAll("path").remove()
	 
	 cat.selectAll("g").remove()
	 
	 d3.select("#top_correlation_container").remove()
	 d3.select("#titre2").selectAll("text").remove()
	 d3.select("#sous_titre2").selectAll("text").remove()
	 
	 render_chord(a)
		
	 }
	  
	  }
	  
	  
		}
		})

	barres.selectAll("text")
		.data(data_bars.sort(function(a,b) {return b.value - a.value;}))
		.enter().append("svg:text")
			.attr("y", function(d, i) {return 10 + i*21;})
			.attr("x", 0)
			.attr("dy", "1.2em")
			.attr("class", "barres")
			.attr("text-anchor", "top")
			.text(function(d) {return d.name;});
			
	var numbers = barres.append("svg:svg")
		.attr("width", wb)
		.attr("height", hb);
		
	numbers.selectAll("text")
		.data(data_bars.sort(function(a,b) {return b.value - a.value;}))
		.enter().append("svg:text")
			.attr("y", function(d, i) {return 10 + i*21;}) 
			.attr("x", function(d) {return translate_barres*1.05 + width_bars(d.value);})
			.attr("dy", "1.2em")
			.attr("class", "barres")
			//.attr("text-anchor", "end")
			.text(function(d) {return mille(format(d.value))+' '+'€';});