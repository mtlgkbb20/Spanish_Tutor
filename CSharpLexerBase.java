
        {
            curlyLevels.push(curlyLevels.pop() - 1);
            if (curlyLevels.peek() == 0)
            {
                curlyLevels.pop();
                skip();
                popMode();
            }
        }
    }

    protected void OnColon()
    {

        if (interpolatedStringLevel > 0)
        {
            int ind = 1;
            boolean switchToFormatString = true;
            while ((char)_input.LA(ind) != '}')
            {
                if (_input.LA(ind) == ':' || _input.LA(ind) == ')')
                {
                    switchToFormatString = false;
                    break;
                }
                ind++;
            }
            {
                mode(CSharpLexer.INTERPOLATION_FORMAT);
            }
        }
    }

    protected void OpenBraceInside()
    {
        curlyLevels.push(1);
    }

    protected void OnDoubleQuoteInside()
    {
        interpolatedStringLevel--;
        interpolatedVerbatiums.pop();
        verbatium = (interpolatedVerbatiums.size() > 1 ? interpolatedVerbatiums.peek() : true);
    }

    protected void OnCloseBraceInside()
    {
        curlyLevels.pop();
    }

    protected boolean IsRegularCharInside()
    {
        return !verbatium;
    }

    protected boolean IsVerbatiumDoubleQuoteInside()
    {
        return verbatium;
    }
}
