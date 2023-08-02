import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://keqwldnnnwadwpvdnmky.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcXdsZG5ubndhZHdwdmRubWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA5NzI2MjUsImV4cCI6MjAwNjU0ODYyNX0.8Q5eWNOa-O4YJ3DTd5CRxEBdi84gUye7yGFLq82mXSU')