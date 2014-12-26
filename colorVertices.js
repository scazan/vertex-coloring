/* Javascript version adapted from the C/C++ code written by Duc Huy Nguyen.
 * Adapted by Scott Cazan (https://github.com/scazan/Matrix-Vertex-Coloring).
 * The original article by Duc Huy Nguyen can be found at: http://www.codeproject.com/Articles/88674/Graph-coloring-using-Recursive-Large-First-RLF-alg
 */

module.exports = function(numNodes, numColumns, adjacencyMatrix) {
	// this program will work with graphs
	// of which number of vertices is smaller or equal to 100
	var MAX = 400;
	// necessary variables
	// n is the number of vertices of the graph
	var n = numNodes;
	var highestNumberOfColors = 0;
	var numColumns;
	// a[n][n] is the adjacency matrix of the graph
	// a[i][j] = 1 if i-th and j-th vertices are adjacent
	var a = [];
	// array color[n] stores the colors of the vertices
	// color[i] = 0 if we 've not colored it yet
	var color = [];
	// array degree[n] stores the degrees of the vertices
	var degree = [];
	// array NN[] stores all the vertices that is not adjacent to current vertex
	var NN = [];
	// NNCount is the number of that set
	var NNCount;
	// unprocessed is the number of vertices with which we 've not worked
	var unprocessed;

	// initializing function
	var Init = function Init() {
		for (var i=0; i < n; i++) {
			color[i] = 0; // be sure that at first, no vertex is colored
			degree[i] = 0; // count the degree of each vertex

			for (var j = 0; j < n; j++) {
				if (a[i][j] == 1) { // if i-th vertex is adjacent to another
					degree[i] ++; // increase its degree by 1
				}
			}
		}
		NNCount = 0; // number of element in NN set
		unprocessed = n;
	}

	// this function finds the unprocessed vertex of which degree is maximum
	var MaxDegreeVertex = function MaxDegreeVertex() {
		var max = -1;
		var max_i;
		for (var i=0; i < n; i++) {
			if (color[i] == 0) {
				if (degree[i]>max) {
					max = degree[i];
					max_i = i;
				}
			}
			return max_i;
		}
	}

	// this function is for UpdateNN function
	// it reset the value of scanned array
	var scannedInit = function scannedInit(scanned) {
		for (var i=0; i < n; i++) {
			scanned[i] = 0;
		}
	}

	// this function updates NN array
	var UpdateNN = function UpdateNN(ColorNumber) {
		NNCount = 0;
		// firstly, add all the uncolored vertices into NN set
		for (var i=0; i < n; i++) {
			if (color[i] == 0){
				NN[NNCount] = i;
				NNCount ++; // when we add a vertex, increase the NNCount
			}
		}
		// then, remove all the vertices in NN that
		// is adjacent to the vertices colored ColorNumber
		for (var i=0; i < n; i++) {
			if (color[i] == ColorNumber) { // find one vertex colored ColorNumber 
				for (var j=0; j < NNCount; j++) {
					while (a[i][NN[j]] == 1) {
						// remove vertex that adjacent to the found vertex
						NN[j] = NN[NNCount - 1];
						NNCount --; // decrease the NNCount
					}
				}
			}
		}
	}

	// this function will find suitable y from NN
	var FindSuitableY = function FindSuitableY(ColorNumber, VerticesInCommon) {
		var temp,tmp_y,y;
		// array scanned stores uncolored vertices
		// except the vertex is being processing
		var scanned = [];
		VerticesInCommon = 0;
		for (var i=0; i < NNCount; i++) { // check the i-th vertex in NN
			// tmp_y is the vertex we are processing
			tmp_y = NN[i];
			// temp is the neighbors in common of tmp_y
			// and the vertices colored ColorNumber
			temp = 0;
			scannedInit(scanned);
			//reset scanned array in order to check all 
			//the vertices if they are adjacent to i-th vertex in NN
			for (var x=0; x < n; x++)
			if (color[x] == ColorNumber) // find one vertex colored ColorNumber
				for (var k=0; k < n; k++)
			if (color[k] == 0 && scanned[k] == 0)
				if (a[x][k] == 1 && a[tmp_y][k] == 1)
					// if k is a neighbor in common of x and tmp_y
					{
						temp ++;
						scanned[k] = 1; // k is scanned
					}
					if (temp > VerticesInCommon)
						{
							VerticesInCommon = temp;
							y = tmp_y;
						}
		}
		return y;
	}

	// find the vertex in NN of which degree is maximum
	var MaxDegreeInNN = function MaxDegreeInNN() {
		var tmp_y; // the vertex has the current maximum degree
		var temp, max = 0;
		for (var i=0; i < NNCount; i++)
		{
			temp = 0;
			for (var j=0; j < n; j++)
			if (color[j] == 0 && a[NN[i]][j] == 1)
				temp ++;
			if (temp>max) // if the degree of vertex NN[i] is higher than tmp_y's one
				{
					max = temp; // assignment NN[i] to tmp_y
					tmp_y = NN[i];
				}
		}
		if (max == 0) // so all the vertices have degree 0
			return NN[0];
		else // exist a maximum, return it
			return tmp_y;
	}

	// processing function
	var Coloring = function Coloring() {
		var x,y;
		var ColorNumber = 0;
		var VerticesInCommon = 0;
		while (unprocessed>0) { // while there is an uncolored vertex
				x = MaxDegreeVertex(); // find the one with maximum degree
				ColorNumber++;
				color[x] = ColorNumber; // give it a new color
				unprocessed--;
				UpdateNN(ColorNumber); // find the set of non-neighbors of x
				while (NNCount>0)
					{
						// find y, the vertex has the maximum neighbors in common with x
						// VerticesInCommon is this maximum number
						y = FindSuitableY(ColorNumber, VerticesInCommon);
						// in case VerticesInCommon = 0
						// y is determined that the vertex with max degree in NN
						if (VerticesInCommon == 0)
							y = MaxDegreeInNN();
						// color y the same to x
						color[y] = ColorNumber;
						unprocessed --;
						UpdateNN(ColorNumber);
						// find the new set of non-neighbors of x
					}

					if(ColorNumber > highestNumberOfColors) {
						highestNumberOfColors = ColorNumber;
					}
			}
	}

	// main function
	var getVertexColors = function getVertexColors() {
		a = adjacencyMatrix;
		Init(); // initialize the data : degree, color array ..
		Coloring(); // working function
		return color;
	};

	// Start processing
	return getVertexColors();
}
