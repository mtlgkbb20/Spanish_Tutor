import java.util.List;
import org.antlr.v4.runtime.*;
import java.io.PrintStream;
import java.util.HashSet;
import java.util.Set;

/**
 * All parser methods that used in grammar (p, prev, notLineTerminator, etc.)
 * should start with lower case char similar to parser rules.
 */
public abstract class GoParserBase extends Parser
{
    private static final boolean debug = false;
    private Set<String> table = new HashSet<>();

    protected GoParserBase(TokenStream input) {
        super(input);
    }

    protected void myreset()
    {
        table = new HashSet<String>();
    }

    /**
     * Returns true if the current Token is a closing bracket (")" or "}")
     */
    protected boolean closingBracket()
    {
        BufferedTokenStream stream = (BufferedTokenStream)_input;
        var la = stream.LT(1);
        return la.getType() == GoLexer.R_PAREN || la.getType() == GoLexer.R_CURLY || la.getType() == Token.EOF;
    }


    protected boolean isNotReceive()
    {
        BufferedTokenStream stream = (BufferedTokenStream)_input;
        var la = stream.LT(2);
        return la.getType() != GoLexer.RECEIVE;
    }

    public void addImportSpec() {
        if (!(this._ctx instanceof GoParser.ImportSpecContext)) {
            return;
        }
        GoParser.ImportSpecContext importSpec = (GoParser.ImportSpecContext) this._ctx;
        if (importSpec == null) {
            return;
        }
        GoParser.PackageNameContext packageName = importSpec.packageName();
        if (packageName != null) {
            String name = packageName.getText();
            if (debug) System.out.println("Entering " + name);
            table.add(name);
        } else {
            String name = importSpec.importPath().getText();
            name = name.replace("\"", "");
            name = name.replace("\\", "/");
            String[] pathArr = name.split("/");
            String[] fileArr = pathArr[pathArr.length - 1].split("\\.");
            String fileName = fileArr[fileArr.length - 1];
            if (debug) System.out.println("Entering " + fileName);
            table.add(fileName);
        }
    }
}
